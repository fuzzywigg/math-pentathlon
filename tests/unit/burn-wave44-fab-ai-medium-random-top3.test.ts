/**
 * Wave 44 overnight HEAVY — Fab AI medium randomness top-3.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — medium random', () => {
  it(
    'randomness branch returns legal move',
    () => {
      const state = createInitialState();
      vi.spyOn(Math, 'random').mockReturnValue(0.01); // < 0.15 randomness
      const move = getAIMove(state, 'player1', 'medium');
      expect(move).not.toBeNull();
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(move!.operation);
    },
    15_000
  );

  it(
    'best path when random high',
    () => {
      const state = createInitialState();
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const move = getAIMove(state, 'player1', 'medium');
      expect(move).not.toBeNull();
    },
    15_000
  );
});
