/**
 * Wave 46 — Kwatro easy high-random leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { getAIMove } from '../../src/games/kwatro-sinko/ai';

describe('Wave 46 kwatro — easy high random', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy random=0.99 returns p1 chip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move?.chipId.startsWith('p1-')).toBe(true);
  });
});
