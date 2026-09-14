/**
 * Wave 44 overnight HEAVY — Fab AI easy teaching branch.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — easy teaching', () => {
  it(
    'returns concrete move on opening',
    () => {
      const state = createInitialState();
      vi.spyOn(Math, 'random').mockReturnValue(0.99); // skip suboptimal branch
      const move = getAIMove(state, 'player1', 'easy');
      expect(move).not.toBeNull();
      expect(move!.bar1Id).not.toBe(move!.bar2Id);
    },
    15_000
  );

  it(
    'can pick suboptimal when random < 0.4',
    () => {
      const state = createInitialState();
      const spy = vi.spyOn(Math, 'random');
      spy.mockReturnValueOnce(0.1).mockReturnValue(0);
      const move = getAIMove(state, 'player1', 'easy');
      expect(move).not.toBeNull();
    },
    15_000
  );
});
