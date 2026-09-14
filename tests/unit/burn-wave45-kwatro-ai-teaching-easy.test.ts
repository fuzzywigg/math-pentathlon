/**
 * Wave 45 — Kwatro easy teaching suboptimal leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { getAIMove } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 kwatro — AI teaching', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy random<0.4 returns legal chip/node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.chipId.startsWith('p1-')).toBe(true);
  });
});
