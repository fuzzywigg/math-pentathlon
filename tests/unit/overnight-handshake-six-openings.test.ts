/**
 * Overnight TOKENMAXX — six-engine openings handshake leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { createInitialState as hagInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as callaInit } from '../../src/games/calla/types';

describe('Overnight handshake — six openings', () => {
  it('each engine opens on player1 without winner', () => {
    expect(fiarInit().currentPlayer).toBe('player1');
    expect(hexInit(5).winner).toBeNull();
    expect(fracInit('easy').phase).toBe('playing');
    expect(starsInit().playerHands.player1.length).toBeGreaterThan(0);
    expect(hagInit().phase).toBe('selectBlocks');
    expect(callaInit().winner).toBeNull();
  });
});
