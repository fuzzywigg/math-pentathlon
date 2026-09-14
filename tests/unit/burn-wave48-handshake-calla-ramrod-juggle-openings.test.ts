/**
 * Wave 48 handshake — calla/ramrod/juggle openings leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { getValidPits } from '../../src/games/calla/rules';
import { hasValidMoves } from '../../src/games/ramrod/rules';

describe('Wave 48 handshake — openings', () => {
  it('all three engines open with playable state', () => {
    const c = callaInit();
    const r = ramrodInit();
    const j = juggleInit();
    expect(getValidPits(c).length).toBe(5);
    expect(hasValidMoves(r)).toBe(true);
    expect(j.phase).toBe('rolling');
    expect(j.winner).toBeNull();
  });
});
