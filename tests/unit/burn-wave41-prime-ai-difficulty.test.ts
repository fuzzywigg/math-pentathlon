/**
 * Wave 41 HEAVY — Prime Gold getAIPlacement easy/medium/hard matrices.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { PrimeGoldState } from '../../src/games/prime-gold/types';
import {
  createInitialState,
  getValidPlacements,
  findCellByValue,
  hasValidMoves,
} from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';

afterEach(() => vi.restoreAllMocks());

function placing(
  dice: { die1: number; die2: number; die3: number },
  overrides: Partial<PrimeGoldState> = {}
): PrimeGoldState {
  return {
    ...createInitialState(),
    diceRoll: dice,
    phase: 'placing',
    ...overrides,
  };
}

describe('Wave 41 Prime Gold — getAIPlacement difficulty matrix', () => {
  it.each(['easy', 'medium', 'hard'] as const)(
    '%s returns a valid placement when moves exist',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const state = placing({ die1: 2, die2: 3, die3: 4 });
      const placement = getAIPlacement(state, 'player1', difficulty);
      expect(placement).not.toBeNull();
      const valids = getValidPlacements(state);
      expect(valids.some((v) => v.value === placement!.value)).toBe(true);
      expect(typeof placement!.expression).toBe('string');
    }
  );

  it('null when wrong seat even if phase is placing', () => {
    const state = placing({ die1: 2, die2: 3, die3: 5 });
    expect(getAIPlacement(state, 'player2', 'hard')).toBeNull();
    expect(getAIPlacement(state, 'player2', 'medium')).toBeNull();
    expect(getAIPlacement(state, 'player2', 'easy')).toBeNull();
  });

  it('null while rolling for every difficulty', () => {
    const state = createInitialState();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      expect(getAIPlacement(state, 'player1', d)).toBeNull();
    }
  });

  it('null when no valid moves remain (owned targets)', () => {
    let state = placing({ die1: 2, die2: 3, die3: 4 });
    const cells = new Map(state.cells);
    for (const p of getValidPlacements(state)) {
      const cell = findCellByValue(state, p.value)!;
      cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player2' });
    }
    state = { ...state, cells };
    expect(hasValidMoves(state)).toBe(false);
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
    expect(getAIPlacement(state, 'player1', 'easy')).toBeNull();
  });

  it('hard prefers a reachable value among valids (deterministic random=0)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = placing({ die1: 3, die2: 4, die3: 5 });
    const hard = getAIPlacement(state, 'player1', 'hard');
    const medium = getAIPlacement(state, 'player1', 'medium');
    expect(hard).not.toBeNull();
    expect(medium).not.toBeNull();
    const values = new Set(getValidPlacements(state).map((p) => p.value));
    expect(values.has(hard!.value)).toBe(true);
    expect(values.has(medium!.value)).toBe(true);
  });

  it('easy teaching path still lands on a valid value under high random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    const state = placing({ die1: 2, die2: 4, die3: 6 });
    const easy = getAIPlacement(state, 'player1', 'easy');
    expect(easy).not.toBeNull();
    expect(
      getValidPlacements(state).some((p) => p.value === easy!.value)
    ).toBe(true);
  });

  it('player2 seat AI only answers when currentPlayer is player2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const p2 = placing(
      { die1: 1, die2: 2, die3: 3 },
      { currentPlayer: 'player2' }
    );
    expect(getAIPlacement(p2, 'player1', 'medium')).toBeNull();
    const move = getAIPlacement(p2, 'player2', 'medium');
    expect(move).not.toBeNull();
    expect(getValidPlacements(p2).some((p) => p.value === move!.value)).toBe(
      true
    );
  });
});
