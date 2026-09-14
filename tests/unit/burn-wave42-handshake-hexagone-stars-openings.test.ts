/**
 * Wave 42 leftovers D — handshake hexagone × stars openings. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as hexInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';

describe('Wave 42 handshake — hexagone × stars openings', () => {
  it('both createInitialState smoke + phases', () => {
    const h = hexInit();
    const s = starsInit();
    expect(h.currentPlayer).toBe('player1');
    expect(s.currentPlayer).toBe('player1');
    expect(h.phase).toBe('selectBlocks');
    expect(s.phase).toBe('selectingCard');
    expect(h.winner).toBeNull();
    expect(s.winner).toBeNull();
    expect(h.phase).not.toBe('gameOver');
    expect(s.phase).not.toBe('gameOver');
  });
});
