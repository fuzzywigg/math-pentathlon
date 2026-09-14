/** Wave 42 — Star Track AI denies giving opponent a winning chain. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { getAIChainChoice } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Star Track — AI deny opp win chain', () => {
  it('hard keeps the chain opponent needs instead of returning it', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // AI far from win; opponent needs exactly 4. Chains 4 and 2.
    // Taking 4 denies opponent; taking 2 would return the winning 4.
    const state = {
      ...createInitialState(),
      player1Position: 0,
      player2Position: TRACK_LENGTH - 4,
      phase: 'selectChain' as const,
      currentPlayer: 'player1' as const,
      drawnChains: [
        { length: 4 as const, id: 1 },
        { length: 2 as const, id: 2 },
      ],
    };
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice?.chainIndex).toBe(0);
  });

  it('hard picks longer safe chain when other would gift a win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: 1,
      player2Position: TRACK_LENGTH - 5,
      phase: 'selectChain' as const,
      currentPlayer: 'player1' as const,
      drawnChains: [
        { length: 3 as const, id: 10 },
        { length: 5 as const, id: 11 },
      ],
    };
    // Taking 3 returns 5 (≥ opp need) — penalized; taking 5 is preferred.
    expect(getAIChainChoice(state, 'player1', 'hard')?.chainIndex).toBe(1);
  });

  it('as player2 AI denies returning player1 winning length', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player1Position: TRACK_LENGTH - 3,
      player2Position: 0,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 1 as const, id: 1 },
        { length: 3 as const, id: 2 },
      ],
    };
    // Taking 1 returns 3 (p1 wins); taking 3 denies.
    expect(getAIChainChoice(state, 'player2', 'hard')?.chainIndex).toBe(1);
  });

  it('medium follows deny preference when randomness skipped', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: 2,
      player2Position: TRACK_LENGTH - 6,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 6 as const, id: 2 },
      ],
    };
    expect(getAIChainChoice(state, 'player1', 'medium')?.chainIndex).toBe(1);
  });
});
