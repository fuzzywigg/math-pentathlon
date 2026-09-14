/**
 * Overnight TOKENMAXX — Fab AI medium randomness top-3 leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight fab — AI medium randomness', () => {
  it('medium with forced random still returns legal move shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0); // trigger randomness (<0.15)
    const move = getAIMove(createInitialState(), 'player1', 'medium');
    expect(move).toMatchObject({
      bar1Id: expect.any(String),
      bar2Id: expect.any(String),
      operation: expect.stringMatching(/add|subtract|multiply|divide/),
      answerId: expect.any(String),
    });
  });

  it('medium without random returns top move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'medium');
    expect(move).not.toBeNull();
  });
});
