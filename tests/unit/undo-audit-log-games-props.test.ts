/**
 * Undo/redo + move-log property tests for remaining moveHistory games.
 * Dice/shuffle entropy is pinned per trial via Math.random so create+reapply is deterministic.
 */
import { describe, it, expect } from 'vitest';
import {
  assertUndoRedoMoveLog,
  mulberry32,
  pickOne,
  serializeState,
  withSeededRandom,
} from './undo-audit-helpers';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primeLegal,
  placeChip as primePlace,
} from '../../src/games/prime-gold/rules';
import type { DiceRoll as PrimeDice } from '../../src/games/prime-gold/types';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  selectCard,
  getValidPlacements as starsLegal,
  placeCard,
} from '../../src/games/stars-bars/rules';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  selectBlock,
  getValidPlacements as parLegal,
  placeBlock,
  passTurn as parPass,
  hasValidMoves as parHasMoves,
} from '../../src/games/par-55/rules';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  selectRod,
  getValidPlacements as ramrodLegal,
  placeRod,
  passTurn as ramrodPass,
  hasValidMoves as ramrodHasMoves,
} from '../../src/games/ramrod/rules';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import {
  selectChip,
  getValidMoves as kwaLegal,
  moveChip,
} from '../../src/games/kwatro-sinko/rules';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  getPossibleResults,
  findMatchingAnswers,
  hasAnyValidMove,
  passTurn as fabPass,
  clearSelection as fabClear,
} from '../../src/games/fab-a-diffy/rules';
import type { FractionOperation } from '../../src/core/fractions/types';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import {
  doRollDice as sumRoll,
  selectDomino,
  getValidPlacements as sumLegal,
  placeDomino,
  passTurn as sumPass,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { getValidPlacements as contigLegal } from '../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  placeChip as contigPlace,
  passTurn as contigPass,
} from '../../src/games/contig-60/rules';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as hagSelect,
  commitSelection,
  placeBlock as hagPlace,
  getValidPlacements as hagLegal,
} from '../../src/games/hex-a-gone/rules';
import {
  getAvailableShapes,
  type BlockShape,
} from '../../src/games/hex-a-gone/types';

import { getShapesForDie } from '../../src/games/juggle/types';
import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  placeShape,
  isPlacementValid,
} from '../../src/games/juggle/rules';
import { findValidPlacements } from '../../src/core/polyomino/placement';

import { createInitialState as createRI } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialState as createPent,
  getPlayerPieces,
  getPentominoShape,
} from '../../src/games/pent-em-in/types';
import {
  getValidPlacements as pentLegal,
  placePiece,
} from '../../src/games/pent-em-in/rules';
import type { Rotation } from '../../src/core/polyomino/types';

function seededCreate<T>(seed: number, create: () => T): T {
  return withSeededRandom(seed, create);
}

describe('Undo audit — prime-gold move log (dice-aware)', () => {
  type Applied = {
    dice: PrimeDice;
    value: number;
    expression: string;
  };

  it('random legal place: undo/redo with dice restore; history matches', () => {
    for (let trial = 0; trial < 20; trial++) {
      const rng = mulberry32(5000 + trial);
      let state = seededCreate(Math.floor(rng() * 1e9), createPrime);
      const snaps = [serializeState(state)];
      const applied: Applied[] = [];

      for (let ply = 0; ply < 10; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (state.phase === 'rolling') {
          state = withSeededRandom(Math.floor(rng() * 1e9), () =>
            primeRoll(state)
          );
        }
        if (state.phase !== 'placing' || !state.diceRoll) break;
        const legal = primeLegal(state);
        if (legal.length === 0) break;
        const pick = pickOne(rng, legal);
        const dice = { ...state.diceRoll };
        const next = primePlace(state, pick.value, pick.expression);
        expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
        const last = next.moveHistory[next.moveHistory.length - 1]!;
        expect(last.result).toBe(pick.value);
        expect(last.expression).toBe(pick.expression);
        expect(last.dice).toEqual(dice);
        applied.push({
          dice,
          value: pick.value,
          expression: pick.expression,
        });
        state = next;
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;

      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = deserializePrime(snaps[0]!);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = { ...rebuilt, diceRoll: a.dice, phase: 'placing' as const };
        rebuilt = primePlace(rebuilt, a.value, a.expression);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);

      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = { ...rebuilt, diceRoll: a.dice, phase: 'placing' as const };
        rebuilt = primePlace(rebuilt, a.value, a.expression);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });
});

function deserializePrime(json: string) {
  const raw = JSON.parse(json) as {
    cells: { __map: [string, unknown][] };
    [k: string]: unknown;
  };
  return {
    ...raw,
    cells: new Map(raw.cells.__map),
  } as ReturnType<typeof createPrime>;
}

describe('Undo audit — stars-bars move log', () => {
  type Applied = { cardId: string; row: number; col: number };

  it('random legal place: undo/redo; history matches card/cell', () => {
    for (let trial = 0; trial < 18; trial++) {
      const rng = mulberry32(6000 + trial);
      const initSeed = Math.floor(rng() * 1e9);
      let state = seededCreate(initSeed, createStars);
      const snaps = [serializeState(state)];
      const applied: Applied[] = [];

      for (let ply = 0; ply < 10; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        const hand = state.playerHands[state.currentPlayer];
        if (hand.length === 0) break;
        // Try cards until one has a placement
        const cards = [...hand];
        let placed = false;
        while (cards.length > 0 && !placed) {
          const card = pickOne(rng, cards);
          cards.splice(cards.indexOf(card), 1);
          let s = selectCard(state, card.id);
          const legal = starsLegal(s);
          if (legal.length === 0) continue;
          const pos = pickOne(rng, legal);
          const next = placeCard(s, pos.row, pos.col);
          expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
          const last = next.moveHistory[next.moveHistory.length - 1]!;
          expect(last.card.id).toBe(card.id);
          expect(last.row).toBe(pos.row);
          expect(last.col).toBe(pos.col);
          applied.push({ cardId: card.id, row: pos.row, col: pos.col });
          state = next;
          snaps.push(serializeState(state));
          placed = true;
        }
        if (!placed) break;
      }
      if (applied.length < 2) continue;

      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = seededCreate(initSeed, createStars);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = selectCard(rebuilt, a.cardId);
        rebuilt = placeCard(rebuilt, a.row, a.col);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = selectCard(rebuilt, a.cardId);
        rebuilt = placeCard(rebuilt, a.row, a.col);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });
});

describe('Undo audit — par-55 / ramrod / kwatro move logs', () => {
  it('par-55: random legal place; history matches; undo/redo via reapply', () => {
    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(7000 + trial);
      const initSeed = Math.floor(rng() * 1e9);
      let state = seededCreate(initSeed, createPar);
      const snaps = [serializeState(state)];
      const applied: Array<{ blockId: string; baseId: string }> = [];

      for (let ply = 0; ply < 10; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (!parHasMoves(state)) {
          state = parPass(state);
          continue; // pass not logged — skip snap for pass-only
        }
        const hand = state.hands[state.currentPlayer];
        let done = false;
        for (const block of [...hand].sort(() => rng() - 0.5)) {
          let s = selectBlock(state, block.id);
          const legal = parLegal(s);
          if (legal.length === 0) continue;
          const baseId = pickOne(rng, legal);
          const next = placeBlock(s, baseId);
          expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
          const last = next.moveHistory[next.moveHistory.length - 1]!;
          expect(last.block.id).toBe(block.id);
          expect(last.baseId).toBe(baseId);
          applied.push({ blockId: block.id, baseId });
          state = next;
          snaps.push(serializeState(state));
          done = true;
          break;
        }
        if (!done) break;
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = seededCreate(initSeed, createPar);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = placeBlock(selectBlock(rebuilt, a.blockId), a.baseId);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = placeBlock(selectBlock(rebuilt, a.blockId), a.baseId);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });

  it('ramrod: random legal place; history matches; undo/redo via reapply', () => {
    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(7100 + trial);
      const initSeed = Math.floor(rng() * 1e9);
      let state = seededCreate(initSeed, createRamrod);
      const snaps = [serializeState(state)];
      const applied: Array<{ rodId: string; boxId: string; slot: number }> =
        [];

      for (let ply = 0; ply < 10; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (!ramrodHasMoves(state)) {
          state = ramrodPass(state);
          continue;
        }
        const rodIds = state.playerRods[state.currentPlayer];
        let done = false;
        for (const rodId of [...rodIds].sort(() => rng() - 0.5)) {
          let s = selectRod(state, rodId);
          const legal = ramrodLegal(s, rodId);
          if (legal.length === 0) continue;
          const place = pickOne(rng, legal);
          const next = placeRod(s, place.boxId, place.slot);
          expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
          const last = next.moveHistory[next.moveHistory.length - 1]!;
          expect(last.rod.id).toBe(rodId);
          expect(last.boxId).toBe(place.boxId);
          applied.push({ rodId, boxId: place.boxId, slot: place.slot });
          state = next;
          snaps.push(serializeState(state));
          done = true;
          break;
        }
        if (!done) break;
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = seededCreate(initSeed, createRamrod);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = placeRod(selectRod(rebuilt, a.rodId), a.boxId, a.slot);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = placeRod(selectRod(rebuilt, a.rodId), a.boxId, a.slot);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });

  it('kwatro-sinko: random legal moves; history matches; undo/redo', () => {
    type Applied = { chipId: string; toNode: string };
    assertUndoRedoMoveLog({
      label: 'kwatro',
      trials: 18,
      maxPlies: 14,
      create: () => createKwa(),
      step: (state, rng) => {
        if (state.phase === 'gameOver' || state.winner) return null;
        const chipIds = [...state.chips.values()]
          .filter((c) => c.owner === state.currentPlayer && c.position)
          .map((c) => c.id);
        const options: Applied[] = [];
        for (const chipId of chipIds) {
          for (const toNode of kwaLegal(state, chipId)) {
            options.push({ chipId, toNode });
          }
        }
        if (options.length === 0) return null;
        const applied = pickOne(rng, options);
        const next = moveChip(selectChip(state, applied.chipId), applied.toNode);
        return {
          state: next,
          applied,
          logEntry: next.moveHistory[next.moveHistory.length - 1],
        };
      },
      reapply: (state, applied) =>
        moveChip(selectChip(state, applied.chipId), applied.toNode),
      getHistory: (s) => s.moveHistory,
      historyMatches: (entry, applied) => {
        const e = entry as { chip: { id: string }; toNode: string };
        return e.chip.id === applied.chipId && e.toNode === applied.toNode;
      },
    });
  });
});

describe('Undo audit — fab-a-diffy move log', () => {
  it('random legal claims; history matches; undo/redo via reapply', () => {
    type Applied = {
      bar1: string;
      bar2: string;
      op: FractionOperation;
      answerId: string;
    };
    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(8000 + trial);
      const initSeed = Math.floor(rng() * 1e9);
      let state = seededCreate(initSeed, createFab);
      const snaps = [serializeState(state)];
      const applied: Applied[] = [];

      for (let ply = 0; ply < 8; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (!hasAnyValidMove(state)) {
          state = fabPass(state);
          continue;
        }
        const unused = [...state.fractionBars.values()].filter((b) => !b.used);
        let found: Applied | null = null;
        outer: for (const b1 of unused) {
          for (const b2 of unused) {
            if (b1.id === b2.id) continue;
            const results = getPossibleResults(b1, b2);
            for (const { operation, result } of results) {
              const answers = findMatchingAnswers(state, result);
              if (answers.length === 0) continue;
              found = {
                bar1: b1.id,
                bar2: b2.id,
                op: operation,
                answerId: pickOne(rng, answers),
              };
              break outer;
            }
          }
        }
        if (!found) break;
        let s = selectBar1(state, found.bar1);
        s = selectBar2(s, found.bar2);
        s = selectOperation(s, found.op);
        const next = executeMove(s, found.answerId);
        if (next.moveHistory.length !== state.moveHistory.length + 1) {
          // Stale candidate (race with prior claim) — clear and retry
          state = fabClear(state);
          continue;
        }
        const last = next.moveHistory[next.moveHistory.length - 1]!;
        expect(last.bar1Id).toBe(found.bar1);
        expect(last.bar2Id).toBe(found.bar2);
        expect(last.operation).toBe(found.op);
        expect(last.resultId).toBe(found.answerId);
        applied.push(found);
        state = next;
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = seededCreate(initSeed, createFab);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = executeMove(
          selectOperation(
            selectBar2(selectBar1(rebuilt, a.bar1), a.bar2),
            a.op
          ),
          a.answerId
        );
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = executeMove(
          selectOperation(
            selectBar2(selectBar1(rebuilt, a.bar1), a.bar2),
            a.op
          ),
          a.answerId
        );
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });
});

describe('Undo audit — sum-dominoes / contig-60 / star-track', () => {
  it('sum-dominoes: places log matches; undo/redo records passes for seat fidelity', () => {
    type Applied =
      | {
          kind: 'place';
          dice: [number, number];
          dominoId: string;
          position: { row: number; col: number };
          orientation: 'horizontal' | 'vertical';
        }
      | { kind: 'pass'; dice: [number, number] | null };

    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(9000 + trial);
      const initSeed = Math.floor(rng() * 1e9);
      let state = seededCreate(initSeed, createSum);
      const snaps = [serializeState(state)];
      const applied: Applied[] = [];

      for (let ply = 0; ply < 14; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (state.phase === 'rolling') {
          state = withSeededRandom(Math.floor(rng() * 1e9), () =>
            sumRoll(state)
          );
        }
        if (state.phase === 'passing') {
          const beforeHist = state.moveHistory.length;
          const diceAtPass = state.currentDice
            ? ([...state.currentDice] as [number, number])
            : null;
          state = sumPass(state);
          // Passes are not logged — still record for undo/redo seat fidelity
          expect(state.moveHistory.length).toBe(beforeHist);
          applied.push({ kind: 'pass', dice: diceAtPass });
          snaps.push(serializeState(state));
          continue;
        }
        if (state.phase !== 'placing' || !state.currentDice) break;
        const sum = getDiceSum(state.currentDice);
        const dice = [...state.currentDice] as [number, number];
        let done = false;
        for (const domino of state.hands[state.currentPlayer]) {
          const legal = sumLegal(state, domino, sum);
          if (legal.length === 0) continue;
          const place = pickOne(rng, legal);
          let s = selectDomino(state, domino.id);
          const next = placeDomino(s, place.position, place.orientation);
          expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
          const last = next.moveHistory[next.moveHistory.length - 1]!;
          expect(last.domino.id).toBe(domino.id);
          applied.push({
            kind: 'place',
            dice,
            dominoId: domino.id,
            position: place.position,
            orientation: place.orientation,
          });
          state = next;
          snaps.push(serializeState(state));
          done = true;
          break;
        }
        if (!done) break;
      }
      const placeCount = applied.filter((a) => a.kind === 'place').length;
      expect(state.moveHistory.length).toBe(placeCount);
      if (placeCount < 2) continue;

      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = deserializeSum(snaps[0]!);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        if (a.kind === 'pass') {
          // Double-pass gameOver retains currentDice from the failed roll
          rebuilt = sumPass({
            ...rebuilt,
            phase: 'passing',
            currentDice: a.dice,
          });
        } else {
          rebuilt = {
            ...rebuilt,
            currentDice: a.dice,
            phase: 'placing',
            selectedDomino: null,
          };
          rebuilt = placeDomino(
            selectDomino(rebuilt, a.dominoId),
            a.position,
            a.orientation
          );
        }
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        if (a.kind === 'pass') {
          rebuilt = sumPass({
            ...rebuilt,
            phase: 'passing',
            currentDice: a.dice,
          });
        } else {
          rebuilt = {
            ...rebuilt,
            currentDice: a.dice,
            phase: 'placing',
            selectedDomino: null,
          };
          rebuilt = placeDomino(
            selectDomino(rebuilt, a.dominoId),
            a.position,
            a.orientation
          );
        }
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });

  it('contig-60: places log matches; undo/redo with dice restore', () => {
    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(9100 + trial);
      let state = createContig();
      const snaps = [serializeState(state)];
      const applied: Array<{
        dice: [number, number, number];
        result: number;
        expression: string;
      }> = [];

      for (let ply = 0; ply < 12; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (state.phase === 'rolling') {
          state = withSeededRandom(Math.floor(rng() * 1e9), () =>
            contigRoll(state)
          );
        }
        if (state.phase !== 'calculating' || !state.currentDice) break;
        const legal = contigLegal(state, state.currentDice);
        if (legal.length === 0) {
          state = contigPass(state);
          continue;
        }
        const pick = pickOne(rng, legal);
        const dice = [...state.currentDice] as [number, number, number];
        const next = contigPlace(state, pick.result, pick.expression);
        expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
        const last = next.moveHistory[next.moveHistory.length - 1]!;
        expect(last.result).toBe(pick.result);
        expect(last.expression).toBe(pick.expression);
        applied.push({
          dice,
          result: pick.result,
          expression: pick.expression,
        });
        state = next;
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = deserializeContig(snaps[0]!);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          currentDice: a.dice,
          phase: 'calculating',
        };
        rebuilt = contigPlace(rebuilt, a.result, a.expression);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          currentDice: a.dice,
          phase: 'calculating',
        };
        rebuilt = contigPlace(rebuilt, a.result, a.expression);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });

  it('star-track: selectChain log matches; undo/redo with drawnChains restore', () => {
    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(9200 + trial);
      const initSeed = Math.floor(rng() * 1e9);
      let state = seededCreate(initSeed, createStar);
      const snaps = [serializeState(state)];
      const applied: Array<{
        drawn: NonNullable<typeof state.drawnChains>;
        bucket: typeof state.chainBucket;
        index: 0 | 1;
      }> = [];

      for (let ply = 0; ply < 12; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (state.phase === 'drawChains') {
          state = drawChains(state);
        }
        if (state.phase !== 'selectChain' || !state.drawnChains) break;
        const index = (rng() < 0.5 ? 0 : 1) as 0 | 1;
        const drawn = state.drawnChains;
        const bucket = state.chainBucket;
        const next = selectChain(state, index);
        expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
        const last = next.moveHistory[next.moveHistory.length - 1]!;
        expect(last.chainUsed).toBe(drawn[index]!.length);
        applied.push({ drawn, bucket, index });
        state = next;
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = seededCreate(initSeed, createStar);
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          drawnChains: a.drawn,
          chainBucket: a.bucket,
          phase: 'selectChain',
        };
        rebuilt = selectChain(rebuilt, a.index);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          drawnChains: a.drawn,
          chainBucket: a.bucket,
          phase: 'selectChain',
        };
        rebuilt = selectChain(rebuilt, a.index);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });
});

function deserializeSum(json: string) {
  const raw = JSON.parse(json);
  return raw as ReturnType<typeof createSum>;
}

function deserializeContig(json: string) {
  const raw = JSON.parse(json) as {
    cells: { __map: [number, unknown][] };
    [k: string]: unknown;
  };
  return {
    ...raw,
    cells: new Map(raw.cells.__map),
  } as ReturnType<typeof createContig>;
}

describe('Undo audit — hex-a-gone / juggle / remainder / pent-em-in', () => {
  it('hex-a-gone: turn history records blocksPlaced; undo/redo via snap reapply', () => {
    for (let trial = 0; trial < 14; trial++) {
      const rng = mulberry32(9300 + trial);
      let state = createHexAGone();
      const snaps = [serializeState(state)];
      const applied: Array<{
        shapes: BlockShape[];
        placements: Array<{ shape: BlockShape; q: number; r: number }>;
      }> = [];

      for (let turn = 0; turn < 6; turn++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (state.phase !== 'selectBlocks') break;
        const available = getAvailableShapes(state);
        if (available.length === 0) break;
        const count = 1 + Math.floor(rng() * Math.min(3, available.length));
        const shapes: BlockShape[] = [];
        const pool = [...available];
        for (let i = 0; i < count && pool.length; i++) {
          const sh = pickOne(rng, pool);
          pool.splice(pool.indexOf(sh), 1);
          shapes.push(sh);
          state = hagSelect(state, sh);
        }
        state = commitSelection(state);
        const placements: Array<{
          shape: BlockShape;
          q: number;
          r: number;
        }> = [];
        while (state.phase === 'placeBlocks') {
          const legal = hagLegal(state);
          if (legal.length === 0) break;
          const pos = pickOne(rng, legal);
          const shape = state.selectedBlockForPlacement!;
          const beforeHist = state.moveHistory.length;
          state = hagPlace(state, pos.q, pos.r);
          placements.push({ shape, q: pos.q, r: pos.r });
          if (state.moveHistory.length > beforeHist) {
            const last = state.moveHistory[state.moveHistory.length - 1]!;
            // Contract (see wave42/47 hexagone history tests): blocksPlaced is
            // turnSelection.blocks at the final placeBlock call — only the last
            // remaining shape(s), not the original multi-block selection.
            expect(last.blocksPlaced).toEqual(
              placements.map((p) => p.shape).slice(-last.blocksPlaced.length)
            );
            expect(last.blocksPlaced.length).toBeGreaterThan(0);
            expect(
              last.blocksPlaced.every((b) => shapes.includes(b))
            ).toBe(true);
          }
        }
        if (placements.length === 0) break;
        applied.push({ shapes, placements });
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = createHexAGone();
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        for (const sh of a.shapes) rebuilt = hagSelect(rebuilt, sh);
        rebuilt = commitSelection(rebuilt);
        for (const p of a.placements) {
          rebuilt = {
            ...rebuilt,
            selectedBlockForPlacement: p.shape,
          };
          rebuilt = hagPlace(rebuilt, p.q, p.r);
        }
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        for (const sh of a.shapes) rebuilt = hagSelect(rebuilt, sh);
        rebuilt = commitSelection(rebuilt);
        for (const p of a.placements) {
          rebuilt = {
            ...rebuilt,
            selectedBlockForPlacement: p.shape,
          };
          rebuilt = hagPlace(rebuilt, p.q, p.r);
        }
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });

  it('juggle: chosenDie matches selected die; undo/redo with dice restore', () => {
    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(9400 + trial);
      let state = createJuggle();
      const snaps = [serializeState(state)];
      const applied: Array<{
        dice: [number, number];
        dieIndex: 0 | 1;
        shapeId: string;
        position: { row: number; col: number };
        rotation: Rotation;
        flipped: boolean;
      }> = [];

      for (let ply = 0; ply < 8; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (state.phase === 'rolling') {
          state = withSeededRandom(Math.floor(rng() * 1e9), () =>
            juggleRoll(state)
          );
        }
        if (state.phase !== 'selectingShape' || !state.currentDice) break;
        const dieIndex = (rng() < 0.5 ? 0 : 1) as 0 | 1;
        const dice = [...state.currentDice] as [number, number];
        state = selectDie(state, dieIndex);
        if (state.phase === 'selectingShape') {
          const shapes = getShapesForDie(dice[dieIndex]!);
          if (shapes.length === 0) break;
          state = selectShape(state, pickOne(rng, shapes));
        }
        if (state.phase !== 'placing' || !state.selectedShape) break;
        const board = state.boards[state.currentPlayer];
        const positions = findValidPlacements(
          board,
          state.selectedShape,
          state.selectedRotation,
          state.selectedFlipped
        );
        if (positions.length === 0) break;
        const position = pickOne(rng, positions);
        expect(isPlacementValid(state, position)).toBe(true);
        const next = placeShape(state, position);
        expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
        const last = next.moveHistory[next.moveHistory.length - 1]!;
        expect(last.chosenDie).toBe(dice[dieIndex]);
        expect(last.shapeId).toBe(state.selectedShape.id);
        applied.push({
          dice,
          dieIndex,
          shapeId: state.selectedShape.id,
          position,
          rotation: state.selectedRotation,
          flipped: state.selectedFlipped,
        });
        state = next;
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = createJuggle();
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          currentDice: a.dice,
          phase: 'selectingShape',
        };
        rebuilt = selectDie(rebuilt, a.dieIndex);
        if (rebuilt.phase === 'selectingShape') {
          const shape = getShapesForDie(a.dice[a.dieIndex]!).find(
            (s) => s.id === a.shapeId
          )!;
          rebuilt = selectShape(rebuilt, shape);
        }
        rebuilt = {
          ...rebuilt,
          selectedRotation: a.rotation,
          selectedFlipped: a.flipped,
        };
        rebuilt = placeShape(rebuilt, a.position);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          currentDice: a.dice,
          phase: 'selectingShape',
        };
        rebuilt = selectDie(rebuilt, a.dieIndex);
        if (rebuilt.phase === 'selectingShape') {
          const shape = getShapesForDie(a.dice[a.dieIndex]!).find(
            (s) => s.id === a.shapeId
          )!;
          rebuilt = selectShape(rebuilt, shape);
        }
        rebuilt = {
          ...rebuilt,
          selectedRotation: a.rotation,
          selectedFlipped: a.flipped,
        };
        rebuilt = placeShape(rebuilt, a.position);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });

  it('remainder-islands: island select log matches; undo/redo with roll restore', () => {
    for (let trial = 0; trial < 16; trial++) {
      const rng = mulberry32(9500 + trial);
      let state = createRI();
      const snaps = [serializeState(state)];
      const applied: Array<{
        roll: NonNullable<typeof state.currentRoll>;
        valid: string[];
        islandId: string;
      }> = [];

      for (let ply = 0; ply < 12; ply++) {
        if (state.phase === 'gameOver' || state.winner) break;
        if (state.phase === 'rolling') {
          state = withSeededRandom(Math.floor(rng() * 1e9), () =>
            performRoll(state)
          );
        }
        if (state.phase !== 'selectIsland' || !state.currentRoll) {
          // skip with no valid islands leaves phase rolling — continue
          if (state.phase === 'rolling') continue;
          break;
        }
        const islandId = pickOne(rng, state.validIslands);
        const roll = state.currentRoll;
        const valid = [...state.validIslands];
        const next = selectIsland(state, islandId);
        expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
        const last = next.moveHistory[next.moveHistory.length - 1]!;
        expect(last.island.id).toBe(islandId);
        expect(last.roll).toEqual(roll);
        applied.push({ roll, valid, islandId });
        state = next;
        snaps.push(serializeState(state));
      }
      if (applied.length < 2) continue;
      const nUndo = 1 + Math.floor(rng() * applied.length);
      const keep = applied.length - nUndo;
      let rebuilt = createRI();
      for (let i = 0; i < keep; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          currentRoll: a.roll,
          validIslands: a.valid,
          phase: 'selectIsland',
        };
        rebuilt = selectIsland(rebuilt, a.islandId);
      }
      expect(serializeState(rebuilt)).toBe(snaps[keep]);
      for (let i = keep; i < applied.length; i++) {
        const a = applied[i]!;
        rebuilt = {
          ...rebuilt,
          currentRoll: a.roll,
          validIslands: a.valid,
          phase: 'selectIsland',
        };
        rebuilt = selectIsland(rebuilt, a.islandId);
      }
      expect(serializeState(rebuilt)).toBe(snaps[applied.length]);
    }
  });

  it('pent-em-in: place log matches; undo/redo via reapply', () => {
    type Applied = {
      shapeId: string;
      position: { row: number; col: number };
      rotation: Rotation;
      flipped: boolean;
    };
    assertUndoRedoMoveLog({
      label: 'pent-em-in',
      trials: 14,
      maxPlies: 8,
      create: () => createPent(),
      step: (state, rng) => {
        if (state.phase === 'gameOver' || state.winner) return null;
        const pieces = getPlayerPieces(state, state.currentPlayer);
        const options: Applied[] = [];
        for (const shapeId of pieces.available) {
          const shape = getPentominoShape(shapeId);
          if (!shape) continue;
          const rotations: Rotation[] = shape.canRotate
            ? [0, 90, 180, 270]
            : [0];
          const flips = shape.canFlip ? [false, true] : [false];
          for (const rotation of rotations) {
            for (const flipped of flips) {
              for (const position of pentLegal(
                state,
                shapeId,
                rotation,
                flipped
              )) {
                options.push({ shapeId, position, rotation, flipped });
              }
            }
          }
          if (options.length > 80) break;
        }
        if (options.length === 0) return null;
        const applied = pickOne(rng, options);
        const next = placePiece(
          state,
          applied.shapeId,
          applied.position,
          applied.rotation,
          applied.flipped
        );
        return {
          state: next,
          applied,
          logEntry: next.moveHistory[next.moveHistory.length - 1],
        };
      },
      reapply: (state, a) =>
        placePiece(state, a.shapeId, a.position, a.rotation, a.flipped),
      getHistory: (s) => s.moveHistory,
      historyMatches: (entry, applied) => {
        const e = entry as Applied;
        return (
          e.shapeId === applied.shapeId &&
          e.position.row === applied.position.row &&
          e.position.col === applied.position.col &&
          e.rotation === applied.rotation &&
          e.flipped === applied.flipped
        );
      },
    });
  });
});

// Keep fabClear referenced for lint friendliness in case of future pass paths
void fabClear;
