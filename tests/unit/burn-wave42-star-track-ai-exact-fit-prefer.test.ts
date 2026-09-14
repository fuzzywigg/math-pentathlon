/** Wave 42 — Star Track AI prefers exact-fit winning chain. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Star Track — AI exact fit prefer', () => {
  it('hard prefers exact length over longer overkill (exact at index 1)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const need = 4;
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - need,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 4 as const, id: 2 },
      ],
    };
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice?.chainIndex).toBe(1);
  });

  it('hard prefers exact when exact is index 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 3,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 3 as const, id: 10 },
        { length: 5 as const, id: 11 },
      ],
    };
    expect(getAIChainChoice(state, 'player1', 'hard')?.chainIndex).toBe(0);
  });

  it('medium also prefers exact fit when randomness skipped', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 1,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 1 as const, id: 1 },
        { length: 6 as const, id: 2 },
      ],
    };
    expect(getAIChainChoice(state, 'player1', 'medium')?.chainIndex).toBe(0);
  });

  it('returns null when not in selectChain', () => {
    const state = createInitialState();
    expect(getAIChainChoice(state, 'player1', 'hard')).toBeNull();
  });
});
