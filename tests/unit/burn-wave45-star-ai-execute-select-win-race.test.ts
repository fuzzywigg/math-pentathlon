/**
 * Wave 45 — Star Track executeAITurn from selectChain wins race
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { executeAITurn } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Star AI — select-phase race win', () => {
  it('selects winning chain from selectChain without drawing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = {
      ...createInitialState(),
      player1Position: TRACK_LENGTH - 4,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 5 as const, id: 2 },
      ],
      currentPlayer: 'player1' as const,
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
    expect(next.player1Position).toBe(TRACK_LENGTH);
  });
});
