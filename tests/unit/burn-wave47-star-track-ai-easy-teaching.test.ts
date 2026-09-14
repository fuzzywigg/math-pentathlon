/**
 * Wave 47 leftover after #214/#215 — Star Track AI easy/medium/hard + executeAITurn leftovers.
 * Tests-only. Avoid pinning Math.random to a constant that loops forever.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import {
  getAIChainChoice,
  isAITurn,
  executeAITurn,
} from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 47 star-track deepen 0 — Star Track — AI teaching', () => {
  it('getAIChainChoice null wrong phase / wrong seat', () => {
    const base = createInitialState();
    expect(getAIChainChoice(base, 'player1', 'hard')).toBeNull();
    const drawn = drawChains(base);
    expect(getAIChainChoice(drawn, 'player2', 'hard')).toBeNull();
  });

  it('hard prefers winning chain when available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // avoid randomness branch
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 2,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 6 as const, id: 2 },
      ],
    };
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice?.chainIndex).toBe(0); // exact win preferred over overkill
  });

  it('easy teaching may pick worse chain when random < 0.4', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = {
      ...createInitialState(),
      player1Position: 0,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 1 },
        { length: 1 as const, id: 2 },
      ],
    };
    const choice = getAIChainChoice(state, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.chainIndex);
  });

  it('isAITurn true only human-vs-ai matching seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
  });

  it('executeAITurn draws and selects for AI seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('drawChains');
    expect(next.moveHistory.length).toBe(1);
  });
});
