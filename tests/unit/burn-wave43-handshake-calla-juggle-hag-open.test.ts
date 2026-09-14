/**
 * Wave 43 — calla/juggle/hag opening handshake leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as hagInit } from '../../src/games/hex-a-gone/types';

describe('Wave 43 handshake — calla juggle hag openings', () => {
  it('three openings: P1, null winner, non-over phase', () => {
    for (const s of [callaInit(), juggleInit(), hagInit()]) {
      expect(s.currentPlayer).toBe('player1');
      expect(s.winner).toBeNull();
      expect(s.phase).not.toMatch(/gameOver/i);
    }
  });
});
