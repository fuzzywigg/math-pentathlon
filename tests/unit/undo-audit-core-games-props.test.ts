/**
 * Undo/redo + move-log property tests for games with deterministic, history-complete
 * apply paths (hex, calla, queens non-restore path, kings, fiar).
 */
import { describe, it, expect } from 'vitest';
import {
  assertUndoRedoMoveLog,
  pickOne,
  serializeState,
  withSeededRandom,
} from './undo-audit-helpers';

import {
  createInitialState as createHex,
  HexGameState,
  HexPosition,
} from '../../src/games/hex/types';
import { makeMove as hexMove, getValidMoves as hexLegal } from '../../src/games/hex/rules';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { makeMove as callaMove, getValidPits } from '../../src/games/calla/rules';

import {
  createInitialState as createQueens,
  parseKey,
  BoardCoord,
  QueensGuardsState,
} from '../../src/games/queens-guards/types';
import {
  makeMove as queensMove,
  getValidMoves as queensLegal,
  restoreCapturedPiece,
  getRestoreTargets,
} from '../../src/games/queens-guards/rules';

import {
  createInitialGameState as createKings,
  moveKing,
  placeQuadraphage,
  GameState as KingsState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  getValidKingMoves,
  getValidQuadraphagePlacements,
} from '../../src/games/kings-quadraphages/rules';

import {
  createInitialState as createFiar,
  FiarGameState,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  moveChip as fiarMove,
  canPlaceChip,
  getSelectableNodes,
  getValidMoves as fiarValidMoves,
} from '../../src/games/fiar/rules';

describe('Undo audit — hex move log / replay', () => {
  it('random legal play: undo/redo via history replay; log matches', () => {
    type Applied = HexPosition;
    assertUndoRedoMoveLog<HexGameState, Applied>({
      label: 'hex',
      trials: 28,
      maxPlies: 20,
      create: () => createHex(7),
      step: (state, rng) => {
        if (state.winner) return null;
        const legal = hexLegal(state);
        if (legal.length === 0) return null;
        const applied = pickOne(rng, legal);
        const next = hexMove(state, applied);
        return {
          state: next,
          applied,
          logEntry: next.moveHistory[next.moveHistory.length - 1],
        };
      },
      reapply: (state, applied) => hexMove(state, applied),
      getHistory: (s) => s.moveHistory,
      historyMatches: (entry, applied) => {
        const e = entry as { position: HexPosition; moveNumber: number };
        return (
          e.position.row === applied.row &&
          e.position.col === applied.col
        );
      },
    });
  });
});

describe('Undo audit — calla move log / replay', () => {
  it('random legal play: undo/redo via history replay; log matches', () => {
    type Applied = number;
    assertUndoRedoMoveLog({
      label: 'calla',
      trials: 28,
      maxPlies: 30,
      create: () => createCalla(),
      step: (state, rng) => {
        if (state.phase === 'gameOver') return null;
        const pits = getValidPits(state);
        if (pits.length === 0) return null;
        const applied = pickOne(rng, pits);
        const next = callaMove(state, applied);
        return {
          state: next,
          applied,
          logEntry: next.moveHistory[next.moveHistory.length - 1],
        };
      },
      reapply: (state, applied) => callaMove(state, applied),
      getHistory: (s) => s.moveHistory,
      historyMatches: (entry, applied) => {
        const e = entry as { pitIndex: number };
        return e.pitIndex === applied;
      },
      // lastSownPit is display-only; include full state for strictness
    });
  });
});

describe('Undo audit — queens & guards move log / replay', () => {
  type QApplied =
    | { kind: 'move'; from: BoardCoord; to: BoardCoord }
    | { kind: 'restore'; from: BoardCoord; to: BoardCoord };

  function listMoves(state: QueensGuardsState): QApplied[] {
    if (state.winner) return [];
    if (state.capturedPieces.length > 0) {
      const from = state.capturedPieces[0]!;
      return getRestoreTargets(state).map((to) => ({
        kind: 'restore' as const,
        from,
        to,
      }));
    }
    const out: QApplied[] = [];
    for (const [key, cell] of state.cells) {
      if (cell.piece?.player !== state.currentPlayer) continue;
      const from = parseKey(key);
      for (const to of queensLegal(state, from)) {
        out.push({ kind: 'move', from, to });
      }
    }
    return out;
  }

  function apply(state: QueensGuardsState, a: QApplied): QueensGuardsState {
    if (a.kind === 'restore') {
      return restoreCapturedPiece(state, a.from, a.to);
    }
    return queensMove(state, a.from, a.to);
  }

  it('random legal play including restores: undo/redo via reapply; move log matches makeMove only', () => {
    // Restores are not logged (see audit doc). Property uses applied-action
    // stack for undo/redo; history length tracks only makeMove plies.
    for (let trial = 0; trial < 24; trial++) {
      const rng = (() => {
        let s = (trial + 3) * 7919;
        return () => {
          s = (s + 0x6d2b79f5) >>> 0;
          let r = Math.imul(s ^ (s >>> 15), 1 | s);
          r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
          return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
      })();

      let state = createQueens();
      const snaps: string[] = [serializeState(state)];
      const applied: QApplied[] = [];
      const loggedKinds: Array<'move' | 'restore'> = [];

      for (let ply = 0; ply < 14; ply++) {
        const legal = listMoves(state);
        if (legal.length === 0) break;
        const a = pickOne(rng, legal);
        const beforeHist = state.moveHistory.length;
        state = apply(state, a);
        if (a.kind === 'move') {
          expect(state.moveHistory.length).toBe(beforeHist + 1);
          const last = state.moveHistory[state.moveHistory.length - 1]!;
          expect(last.from).toEqual(a.from);
          expect(last.to).toEqual(a.to);
          loggedKinds.push('move');
        } else {
          // Clear bug candidate documented: restore does not append history
          expect(state.moveHistory.length).toBe(beforeHist);
          loggedKinds.push('restore');
        }
        applied.push(a);
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;

      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let undone = createQueens();
      for (let i = 0; i < keep; i++) undone = apply(undone, applied[i]!);
      expect(serializeState(undone)).toBe(snaps[keep]);

      let redone = undone;
      for (let i = keep; i < applied.length; i++) {
        redone = apply(redone, applied[i]!);
      }
      expect(serializeState(redone)).toBe(snaps[applied.length]);

      const moveCount = loggedKinds.filter((k) => k === 'move').length;
      expect(state.moveHistory.length).toBe(moveCount);
    }
  });
});

describe('Undo audit — kings & quadraphages move log / replay', () => {
  type KApplied =
    | { action: 'moveKing'; to: { row: number; col: number } }
    | { action: 'placeQuadraphage'; to: { row: number; col: number } };

  function apply(state: KingsState, a: KApplied): KingsState {
    if (a.action === 'moveKing') return moveKing(state, a.to);
    return placeQuadraphage(state, a.to);
  }

  it('random legal play: undo/redo via reapply; history matches actions', () => {
    assertUndoRedoMoveLog<KingsState, KApplied>({
      label: 'kings',
      trials: 24,
      maxPlies: 20,
      create: () => createKings(),
      step: (state, rng) => {
        if (state.turnPhase === 'gameOver' || state.winner) return null;
        if (state.turnPhase === 'moveKing') {
          const legal0 = getValidKingMoves(state, state.currentPlayer);
          if (legal0.length === 0) return null;
          const dest0 = pickOne(rng, legal0);
          const applied: KApplied = {
            action: 'moveKing',
            to: { row: dest0.row + 1, col: dest0.col + 1 },
          };
          const next = apply(state, applied);
          return {
            state: next,
            applied,
            logEntry: next.moveHistory[next.moveHistory.length - 1],
          };
        }
        const legal0 = getValidQuadraphagePlacements(state);
        if (legal0.length === 0) return null;
        const dest0 = pickOne(rng, legal0);
        const applied: KApplied = {
          action: 'placeQuadraphage',
          to: { row: dest0.row + 1, col: dest0.col + 1 },
        };
        const next = apply(state, applied);
        return {
          state: next,
          applied,
          logEntry: next.moveHistory[next.moveHistory.length - 1],
        };
      },
      reapply: apply,
      getHistory: (s) => s.moveHistory,
      historyMatches: (entry, applied) => {
        const e = entry as {
          action: string;
          to: { row: number; col: number };
        };
        return (
          e.action === applied.action &&
          e.to.row === applied.to.row &&
          e.to.col === applied.to.col
        );
      },
    });
  });
});

describe('Undo audit — fiar move log / replay', () => {
  type FApplied =
    | { type: 'place'; nodeId: string; chipKind: 'plain' | 'marked' }
    | { type: 'move'; fromNodeId: string; nodeId: string };

  function emptyPlaceNodes(state: FiarGameState): string[] {
    const ids: string[] = [];
    for (const [id, node] of state.board.nodes) {
      if (node.chip === null && canPlaceChip(state, id)) ids.push(id);
    }
    return ids;
  }

  function apply(state: FiarGameState, a: FApplied): FiarGameState {
    if (a.type === 'place') return fiarPlace(state, a.nodeId, a.chipKind);
    return fiarMove(state, a.fromNodeId, a.nodeId);
  }

  it('random legal place/move: undo/redo via reapply; history matches', () => {
    assertUndoRedoMoveLog<FiarGameState, FApplied>({
      label: 'fiar',
      trials: 24,
      maxPlies: 18,
      create: () => createFiar(),
      step: (state, rng) => {
        if (state.phase === 'gameOver' || state.winner) return null;
        if (state.phase === 'placement') {
          const nodes = emptyPlaceNodes(state);
          if (nodes.length === 0) return null;
          const nodeId = pickOne(rng, nodes);
          const kind = state.selectedChipKind;
          const applied: FApplied = { type: 'place', nodeId, chipKind: kind };
          const next = apply(state, applied);
          return {
            state: next,
            applied,
            logEntry: next.moveHistory[next.moveHistory.length - 1],
          };
        }
        const fromIds = getSelectableNodes(state);
        if (fromIds.length === 0) return null;
        const fromNodeId = pickOne(rng, fromIds);
        const tos = fiarValidMoves(state, fromNodeId);
        if (tos.length === 0) return null;
        const nodeId = pickOne(rng, tos);
        const applied: FApplied = { type: 'move', fromNodeId, nodeId };
        const next = apply(state, applied);
        return {
          state: next,
          applied,
          logEntry: next.moveHistory[next.moveHistory.length - 1],
        };
      },
      reapply: apply,
      getHistory: (s) => s.moveHistory,
      historyMatches: (entry, applied) => {
        const e = entry as {
          type: string;
          nodeId: string;
          fromNodeId?: string;
          chipKind?: string;
        };
        if (applied.type === 'place') {
          return (
            e.type === 'place' &&
            e.nodeId === applied.nodeId &&
            e.chipKind === applied.chipKind
          );
        }
        return (
          e.type === 'move' &&
          e.nodeId === applied.nodeId &&
          e.fromNodeId === applied.fromNodeId
        );
      },
    });
  });
});

describe('Undo audit — smoke: seeded hex full replay equals live', () => {
  it('replaying moveHistory positions from initial rebuilds board', () => {
    withSeededRandom(42, () => {
      let live = createHex(5);
      for (let i = 0; i < 10 && !live.winner; i++) {
        const legal = hexLegal(live);
        if (!legal.length) break;
        live = hexMove(live, legal[i % legal.length]!);
      }
      let rebuilt = createHex(5);
      for (const m of live.moveHistory) {
        rebuilt = hexMove(rebuilt, m.position);
      }
      expect(serializeState(rebuilt.board)).toBe(serializeState(live.board));
      expect(rebuilt.moveHistory.length).toBe(live.moveHistory.length);
    });
  });
});
