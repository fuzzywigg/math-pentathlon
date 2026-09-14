/**
 * Wave 41 — Contig 60 roll / place / points leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
} from '../../src/games/contig-60/types';
import type { ContigState, Player } from '../../src/games/contig-60/types';
import {
  doRollDice,
  placeChip,
  calculatePoints,
  hasValidMoves,
} from '../../src/games/contig-60/rules';

afterEach(() => vi.restoreAllMocks());

function withDice(
  dice: [number, number, number],
  overrides: Partial<ContigState> = {}
): ContigState {
  return {
    ...createInitialState(),
    phase: 'calculating',
    currentDice: dice,
    ...overrides,
  };
}

function claim(
  state: ContigState,
  values: number[],
  owner: Player
): ContigState {
  const cells = new Map(state.cells);
  for (const value of values) {
    const cell = cells.get(value)!;
    cells.set(value, { ...cell, owner });
  }
  return { ...state, cells };
}

describe('Wave 41 Contig — roll / place / points', () => {
  it.each([0, 0.5, 0.99] as const)(
    'doRollDice seeded random=%s → calculating with three dice in 1..6',
    (seed) => {
      vi.spyOn(Math, 'random').mockReturnValue(seed);
      const next = doRollDice(createInitialState());
      expect(next.phase).toBe('calculating');
      expect(next.currentDice).toHaveLength(3);
      expect(next.currentDice!.every((d) => d >= 1 && d <= 6)).toBe(true);
    }
  );

  it('doRollDice is identity outside rolling', () => {
    const mid = withDice([2, 3, 4]);
    expect(doRollDice(mid)).toBe(mid);
    const over = { ...createInitialState(), phase: 'gameOver' as const };
    expect(doRollDice(over)).toBe(over);
  });

  it('placeChip scores adjacency, flips seat, clears dice', () => {
    let state = withDice([1, 2, 2]);
    // Claim neighbors of 5 (row0 col4): 4 and 6
    state = claim(state, [4, 6], 'player2');
    const pts = calculatePoints(state, 5);
    expect(pts).toBeGreaterThanOrEqual(2);
    const next = placeChip(state, 5, '(1 + 2) * 2');
    expect(next.cells.get(5)?.owner).toBe('player1');
    expect(next.scores.player1).toBe(pts);
    expect(next.currentPlayer).toBe('player2');
    expect(next.currentDice).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].result).toBe(5);
    expect(next.consecutivePasses.player1).toBe(0);
  });

  it('placeChip rejects owned / missing / wrong phase / no dice', () => {
    const rolling = createInitialState();
    expect(placeChip(rolling, 1, '1')).toBe(rolling);
    let state = withDice([2, 3, 4]);
    state = claim(state, [6], 'player1');
    expect(placeChip(state, 6, '2*3')).toBe(state);
    expect(placeChip(state, 9999, 'x')).toBe(state);
    const noDice = { ...state, currentDice: null };
    expect(placeChip(noDice, 24, '2*3*4')).toBe(noDice);
  });

  it('hasValidMoves tracks dice presence and claimed board', () => {
    expect(hasValidMoves(createInitialState())).toBe(false);
    const open = withDice([2, 3, 4]);
    expect(hasValidMoves(open)).toBe(true);
    const all = getValidPlacements(open, [2, 3, 4]).map((p) => p.result);
    const jammed = claim(open, all, 'player2');
    expect(hasValidMoves(jammed)).toBe(false);
  });

  it('isolated corner place yields 0 points', () => {
    const state = withDice([1, 1, 1]);
    expect(calculatePoints(state, 1)).toBe(0);
    const next = placeChip(state, 1, '(1*1)*1');
    expect(next.scores.player1).toBe(0);
    expect(next.cells.get(1)?.owner).toBe('player1');
  });
});
