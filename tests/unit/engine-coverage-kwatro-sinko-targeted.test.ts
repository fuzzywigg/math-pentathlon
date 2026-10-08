/**
 * Targeted branch coverage for kwatro-sinko/rules.ts — hand-built states only.
 * Covers edge-of-board moves, illegal input rejection, win-detection corners,
 * and turn handoff. Does not change engine code.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  getValidMoves,
  allChipsOffNumbered,
  findWinningAlignment,
  checkTrioForWin,
  hasValidMoves,
  passTurn,
  clearSelection,
} from '../../src/games/kwatro-sinko/rules';
import type { BoardNode, Chip, KwaState } from '../../src/games/kwatro-sinko/types';

function placeChip(state: KwaState, chipId: string, nodeId: string): KwaState {
  const chip = state.chips.get(chipId);
  if (!chip) throw new Error(`missing chip ${chipId}`);

  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);

  if (chip.position) {
    const old = nodes.get(chip.position);
    if (old) nodes.set(chip.position, { ...old, chip: null });
  }

  const updated: Chip = { ...chip, position: nodeId };
  chips.set(chipId, updated);
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`missing node ${nodeId}`);
  nodes.set(nodeId, { ...node, chip: updated });

  return { ...state, nodes, chips };
}

function entry(
  nodeId: string,
  chip: Chip
): { node: BoardNode; chip: Chip } {
  return {
    node: {
      id: nodeId,
      x: 0,
      y: 0,
      isNumbered: false,
      chip,
      connections: [],
    },
    chip,
  };
}

describe('Kwatro-Sinko targeted — edge-of-board + illegal rejection', () => {
  it('corner chip (n0-0) only offers in-bound edge destinations', () => {
    const state = createInitialState();
    const moves = getValidMoves(state, 'p1-0');
    // Top-left corner: down to n1-0 (n0-1 occupied by sibling)
    expect(moves).toContain('n1-0');
    expect(moves.every((id) => /^n[0-4]-[0-4]$/.test(id))).toBe(true);
    expect(moves).not.toContain('n-1-0');
    expect(moves).not.toContain('n0--1');
  });

  it('bottom-right corner chip (n4-4) rejects off-board / occupied siblings', () => {
    const state = createInitialState();
    state.currentPlayer = 'player2';
    const moves = getValidMoves(state, 'p2-4');
    expect(moves).toContain('n3-4');
    expect(isOffBoardFree(moves)).toBe(true);
    const selected = selectChip(state, 'p2-4');
    expect(selected.phase).toBe('selectingDest');
    expect(moveChip(selected, 'n5-4')).toBe(selected); // off-board id rejected
  });

  it('getValidMoves returns [] when chip.position points at a missing node', () => {
    const state = createInitialState();
    const chip = state.chips.get('p1-0')!;
    state.chips.set('p1-0', { ...chip, position: 'ghost-node' });
    expect(getValidMoves(state, 'p1-0')).toEqual([]);
  });

  it('selectChip / moveChip reject wrong phase, missing chip, and illegal dest', () => {
    const open = createInitialState();
    const wrongPhase = { ...open, phase: 'selectingDest' as const };
    expect(selectChip(wrongPhase, 'p1-0')).toBe(wrongPhase);
    expect(selectChip(open, 'missing-chip')).toBe(open);

    const selected = selectChip(open, 'p1-0');
    expect(moveChip(open, 'n1-0')).toBe(open); // wrong phase
    expect(moveChip(selected, 'n4-4')).toBe(selected); // not adjacent
  });

  it('clearSelection + passTurn hand off seat cleanly', () => {
    const selected = selectChip(createInitialState(), 'p1-2');
    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingChip');
    expect(cleared.selectedChip).toBeNull();

    const passed = passTurn(selected);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.selectedChip).toBeNull();
    expect(hasValidMoves(passed)).toBe(true);
  });
});

describe('Kwatro-Sinko targeted — win detection corners', () => {
  it('allChipsOffNumbered false for empty seat and for null-position chips', () => {
    const state = createInitialState();
    const emptyChips = new Map<string, Chip>();
    expect(allChipsOffNumbered(state.nodes, emptyChips, 'player1')).toBe(false);

    const chips = new Map(state.chips);
    const floating = { ...chips.get('p1-0')!, position: null };
    chips.set('p1-0', floating);
    // Remaining p1 chips still on numbered home row → false via !position short-circuit
    expect(allChipsOffNumbered(state.nodes, chips, 'player1')).toBe(false);
  });

  it('findWinningAlignment null on empty node and malformed node id', () => {
    const state = createInitialState();
    expect(findWinningAlignment(state.nodes, 'n2-2')).toBeNull(); // empty center

    const nodes = new Map(state.nodes);
    const chip: Chip = {
      id: 'x',
      value: 4,
      owner: 'player1',
      position: 'weird',
    };
    nodes.set('weird', {
      id: 'weird',
      x: 0,
      y: 0,
      isNumbered: false,
      chip,
      connections: [],
    });
    expect(findWinningAlignment(nodes, 'weird')).toBeNull();
  });

  it('checkTrioForWin rejects non-triples', () => {
    const a: Chip = { id: 'a', value: 6, owner: 'player1', position: 'n2-0' };
    const b: Chip = { id: 'b', value: 2, owner: 'player1', position: 'n2-2' };
    expect(checkTrioForWin([entry('n2-0', a), entry('n2-2', b)])).toBeNull();
  });

  it('win via findAnyWinningAlignment when clinch move is off the winning line', () => {
    // Pre-place 6 + 2 − 3 = 5 on row 2; last Blue chip leaves home row elsewhere.
    let state = createInitialState();
    state = placeChip(state, 'p1-3', 'n2-0'); // 6
    state = placeChip(state, 'p2-1', 'n2-1'); // 3
    state = placeChip(state, 'p1-1', 'n2-2'); // 2 — alignment already present
    state = placeChip(state, 'p1-0', 'n1-0');
    state = placeChip(state, 'p1-2', 'n1-1');
    // p1-4 (8) still on n0-4 (numbered); slide to n1-4 (not on the win line)
    expect(allChipsOffNumbered(state.nodes, state.chips, 'player1')).toBe(false);

    const result = moveChip(selectChip(state, 'p1-4'), 'n1-4');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.winningAlignment?.result).toBe(5);
    expect(result.winningAlignment?.nodes.sort()).toEqual(
      ['n2-0', 'n2-1', 'n2-2'].sort()
    );
    expect(result.currentPlayer).toBe('player1'); // no handoff on win
  });
});

function isOffBoardFree(moves: string[]): boolean {
  return moves.every((id) => {
    const m = id.match(/^n(\d+)-(\d+)$/);
    if (!m) return false;
    const r = Number(m[1]);
    const c = Number(m[2]);
    return r >= 0 && r < 5 && c >= 0 && c < 5;
  });
}
