/**
 * Wave 42 — Prime Gold passTurn leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, rollDice, passTurn } from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 prime — passTurn', () => {
  it('from placing clears diceRoll and returns to rolling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const placing = rollDice(createInitialState());
    expect(placing.phase).toBe('placing');
    expect(placing.diceRoll).not.toBeNull();
    const next = passTurn(placing);
    expect(next.diceRoll).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
  });

  it('flips player from player2 to player1', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player1');
  });

  it('identity on gameOver — winner and phase unchanged', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      diceRoll: { die1: 1, die2: 1, die3: 1 },
    };
    expect(passTurn(over)).toBe(over);
  });

  it('works from rolling phase (clears dice if any)', () => {
    const rolling = createInitialState();
    const next = passTurn(rolling);
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
    expect(next.currentPlayer).toBe('player2');
  });
});
