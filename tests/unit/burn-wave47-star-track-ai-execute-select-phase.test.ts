/**
 * Wave 47 leftover after #214/#215 — Star Track executeAITurn from selectChain skips draw.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { executeAITurn } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 47 star-track deepen 9 — Star Track AI — execute select', () => {
  it('selectChain phase selects without re-drawing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const drawn = [
      { length: 5 as const, id: 10 },
      { length: 1 as const, id: 11 },
    ];
    const state = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: drawn,
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('drawChains');
    expect(next.moveHistory.length).toBe(1);
    expect(next.player1Position).toBe(5);
  });
});
