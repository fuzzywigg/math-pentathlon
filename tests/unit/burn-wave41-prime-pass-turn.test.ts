/**
 * Wave 41 HEAVY — Prime Gold passTurn phase / seat matrices.
 * Tests-only. (wave35 covered empty-valids pass + gameOver identity)
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import type { PrimeGoldState } from '../../src/games/prime-gold/types';
import {
  createInitialState,
  rollDice,
  passTurn,
  getValidPlacements,
  hasValidMoves,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

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

describe('Wave 41 Prime Gold — passTurn matrices', () => {
  it('from rolling: flips seat, stays rolling, keeps null dice', () => {
    const state = createInitialState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
    expect(next.cells).toBe(state.cells);
  });

  it('from placing with dice: clears dice and returns to rolling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const rolled = rollDice(createInitialState());
    expect(rolled.diceRoll).not.toBeNull();
    const next = passTurn(rolled);
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
  });

  it('player2 pass returns seat to player1', () => {
    const state = placing(
      { die1: 4, die2: 4, die3: 4 },
      { currentPlayer: 'player2' }
    );
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player1');
    expect(next.phase).toBe('rolling');
  });

  it('does not alter chip counts or move history', () => {
    const state = placing({ die1: 1, die2: 2, die3: 3 });
    const next = passTurn(state);
    expect(next.playerChips).toEqual(state.playerChips);
    expect(next.moveHistory).toEqual(state.moveHistory);
    expect(next.primeVeins).toEqual(state.primeVeins);
    expect(next.winner).toBeNull();
  });

  it('pass after owned-out placements still flips even when hasValidMoves false', () => {
    let state = placing({ die1: 2, die2: 3, die3: 4 });
    const placements = getValidPlacements(state);
    const cells = new Map(state.cells);
    for (const p of placements) {
      const cell = findCellByValue(state, p.value)!;
      cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player2' });
    }
    state = { ...state, cells };
    expect(hasValidMoves(state)).toBe(false);
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
  });

  it('double pass cycles seat player1 → player2 → player1', () => {
    const a = passTurn(createInitialState());
    const b = passTurn(a);
    expect(a.currentPlayer).toBe('player2');
    expect(b.currentPlayer).toBe('player1');
    expect(b.phase).toBe('rolling');
  });

  it('gameOver identity preserves winner reference', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(passTurn(state)).toBe(state);
    expect(state.winner).toBe('player1');
  });
});
