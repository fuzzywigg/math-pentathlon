/**
 * Wave 44 — Contig pass elim player2 leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import { passTurn } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — pass elim p2', () => {
  it('eliminates player2 after MAX passes', () => {
    const s = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentPlayer: 'player2' as const,
      consecutivePasses: {
        player1: 0,
        player2: CONFIG.MAX_CONSECUTIVE_PASSES - 1,
      },
    };
    const ended = passTurn(s);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
  });
});
