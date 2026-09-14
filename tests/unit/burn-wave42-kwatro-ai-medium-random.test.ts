/**
 * Wave 42 — Kwatro-Sinko getAIMove medium difficulty with mocked randomness. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, passTurn } from '../../src/games/kwatro-sinko/rules';
import { getAIMove } from '../../src/games/kwatro-sinko/ai';

describe('Wave 42 kwatro-sinko — AI medium random', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('medium returns a legal chip and destination on player2 opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = passTurn(createInitialState());
    const move = getAIMove(state, 'player2', 'medium');

    expect(move).not.toBeNull();
    expect(move!.chipId).toMatch(/^p2-/);
    expect(move!.nodeId).toMatch(/^n\d-\d$/);
  });

  it('medium randomness branch picks from evaluated moves when random is low', () => {
    const state = passTurn(createInitialState());
    const deterministic = getAIMove(state, 'player2', 'medium');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const randomized = getAIMove(state, 'player2', 'medium');

    expect(randomized).not.toBeNull();
    expect(randomized!.chipId).toMatch(/^p2-/);
    // With random=0, should still be a valid move (possibly same as top)
    expect(randomized!.nodeId).toMatch(/^n\d-\d$/);
    expect(deterministic).not.toBeNull();
  });

  it('medium returns null when not AI seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    expect(getAIMove(state, 'player2', 'medium')).toBeNull();
  });

  it('medium returns null on gameOver regardless of random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(state, 'player1', 'medium')).toBeNull();
  });
});
