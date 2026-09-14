/**
 * Wave 47 leftover after #214/#215 — Star Track AI exact-fit win preferred over overkill.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 47 star-track deepen 8 — Star Track AI — exact fit', () => {
  it('medium prefers exact 3 over overkill 6 when needing 3', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 3,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 3 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    expect(getAIChainChoice(state, 'player1', 'medium')?.chainIndex).toBe(1);
  });
});
