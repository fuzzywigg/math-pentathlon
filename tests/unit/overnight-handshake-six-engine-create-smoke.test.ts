/**
 * Overnight HEAVY after #214/#215 — createInitialState smoke across six engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as calla } from '../../src/games/calla/types';
import { createInitialState as juggle } from '../../src/games/juggle/rules';
import { createInitialState as hex } from '../../src/games/hex-a-gone/types';
import { createInitialState as ram } from '../../src/games/ramrod/rules';
import { createInitialState as stars } from '../../src/games/stars-bars/rules';
import { createInitialState as sum } from '../../src/games/sum-dominoes/rules';

describe('Overnight handshake — createInitialState smoke', () => {
  it('each leftover engine opens on player1 with a defined phase', () => {
    expect(calla().currentPlayer).toBe('player1');
    expect(juggle().currentPlayer).toBe('player1');
    expect(hex().currentPlayer).toBe('player1');
    expect(ram().currentPlayer).toBe('player1');
    expect(stars().currentPlayer).toBe('player1');
    expect(sum().currentPlayer).toBe('player1');
    expect(calla().phase).toBeTruthy();
    expect(juggle().phase).toBe('rolling');
    expect(hex().phase).toBe('selectBlocks');
    expect(ram().phase).toBe('selectingRod');
    expect(stars().phase).toBeTruthy();
    expect(sum().phase).toBe('rolling');
  });
});
