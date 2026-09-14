/**
 * Wave 47 leftover after #214/#215 — Star Track AI medium randomness still picks 0|1.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 47 star-track deepen 10 — Star Track AI — medium random', () => {
  it('medium random branch returns a chain index', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 4 as const, id: 1 },
        { length: 2 as const, id: 2 },
      ],
    };
    const choice = getAIChainChoice(state, 'player1', 'medium');
    expect([0, 1]).toContain(choice!.chainIndex);
  });
});
