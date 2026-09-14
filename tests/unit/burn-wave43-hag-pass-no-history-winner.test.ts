/**
 * Wave 43 — passTurn mutual stuck empty history leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { passTurn } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — pass no history winner', () => {
  it('mutual stuck with empty history → winner falls back to current', () => {
    const s = {
      ...createInitialState(),
      board: createInitialState().board.map((c) => ({
        ...c,
        filled: true,
        filledBy: 'player1' as const,
      })),
      moveHistory: [],
    };
    const next = passTurn(s);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
