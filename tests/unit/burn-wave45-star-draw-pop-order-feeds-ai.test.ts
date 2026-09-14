/**
 * Wave 45 — Star Track draw pop order feeds AI choice
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star — draw pop order + AI', () => {
  it('pops last two as drawn [b,a] and hard picks the longer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const a = { length: 2 as const, id: 1 };
    const b = { length: 5 as const, id: 2 };
    const drawn = drawChains({
      ...createInitialState(),
      chainBucket: [{ length: 1 as const, id: 0 }, a, b],
      phase: 'drawChains',
    });
    expect(drawn.drawnChains).toEqual([b, a]);
    expect(getAIChainChoice(drawn, 'player1', 'hard')?.chainIndex).toBe(0);
  });
});
