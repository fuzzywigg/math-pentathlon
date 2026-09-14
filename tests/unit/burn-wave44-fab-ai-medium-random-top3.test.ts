/**
 * Wave 44 overnight HEAVY — Fab AI medium randomness top-3.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — medium random', () => {
  it('randomness branch returns legal move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // < 0.15 randomness
    const move = getAIMove(createInitialState(), 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(['add', 'subtract', 'multiply', 'divide']).toContain(move!.operation);
  });

  it('best path when random high', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'medium');
    expect(move).not.toBeNull();
  });
});
