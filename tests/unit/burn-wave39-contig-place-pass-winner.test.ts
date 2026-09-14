/**
 * Wave 39 — Contig placeChip / passTurn / checkWinner leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  CONFIG,
  getValidPlacements,
} from '../../src/games/contig-60/types';
import {
  doRollDice,
  placeChip,
  passTurn,
  checkWinner,
  hasValidMoves,
} from '../../src/games/contig-60/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 39 Contig — place pass winner', () => {
  it('placeChip identity wrong phase / occupied', () => {
    const base = createInitialState();
    expect(placeChip(base, 1, '1+1')).toBe(base);
    const rolled = doRollDice(base);
    const occupied = {
      ...rolled,
      cells: new Map(
        [...rolled.cells.entries()].map(([k, v]) => [
          k,
          k === [...rolled.cells.keys()][0]
            ? { ...v, owner: 'player2' as const }
            : v,
        ])
      ),
    };
    const first = [...occupied.cells.keys()][0];
    expect(placeChip(occupied, first, 'x')).toBe(occupied);
  });

  it('successful place swaps turn and returns to rolling', () => {
    // Force dice that yield placements by retrying
    let placed = false;
    for (let attempt = 0; attempt < 40 && !placed; attempt++) {
      let state = createInitialState();
      state = doRollDice(state);
      const dice = state.currentDice!;
      const valids = getValidPlacements(state, dice);
      if (valids.length === 0) continue;
      const pick = valids[0];
      const next = placeChip(state, pick.result, pick.expression);
      expect(next.phase).toBe('rolling');
      expect(next.currentPlayer).toBe('player2');
      expect(next.cells.get(pick.result)?.owner).toBe('player1');
      expect(next.moveHistory).toHaveLength(1);
      placed = true;
    }
    expect(placed).toBe(true);
  });

  it('passTurn increments consecutive passes; max eliminates', () => {
    let state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
      consecutivePasses: { player1: CONFIG.MAX_CONSECUTIVE_PASSES - 1, player2: 0 },
    };
    state = passTurn(state);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player2');
  });

  it('passTurn mid-level swaps seat', () => {
    let state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [2, 2, 2] as [number, number, number],
    };
    state = passTurn(state);
    expect(state.phase).toBe('rolling');
    expect(state.currentPlayer).toBe('player2');
    expect(state.consecutivePasses.player1).toBe(1);
  });

  it('checkWinner null on empty; hasValidMoves false without dice', () => {
    const state = createInitialState();
    expect(checkWinner(state)).toBeNull();
    expect(hasValidMoves(state)).toBe(false);
  });
});
