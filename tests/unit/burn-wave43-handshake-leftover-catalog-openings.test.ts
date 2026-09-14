/**
 * Wave 43 — leftover five-engine catalog openings handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as calla } from '../../src/games/calla/types';
import { createInitialState as juggle } from '../../src/games/juggle/rules';
import { createInitialState as hag } from '../../src/games/hex-a-gone/types';
import { createInitialState as ramrod } from '../../src/games/ramrod/rules';
import { createInitialState as stars } from '../../src/games/stars-bars/rules';

describe('Wave 43 handshake — leftover catalog openings', () => {
  it('all five leftover engines open with empty history', () => {
    expect(calla().moveHistory).toEqual([]);
    expect(juggle().moveHistory).toEqual([]);
    expect(hag().moveHistory).toEqual([]);
    expect(ramrod().moveHistory).toEqual([]);
    expect(stars().moveHistory).toEqual([]);
  });
});
