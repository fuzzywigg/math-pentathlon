/**
 * Wave 43 — Handshake hag×calla Blue/Red phase naming. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as hag } from '../../src/games/hex-a-gone/types';
import { createInitialState as calla } from '../../src/games/calla/types';
import { getPhaseMessage as hagMsg } from '../../src/games/hex-a-gone/rules';
import { getPhaseMessage as callaMsg } from '../../src/games/calla/rules';

describe('Wave 43 handshake — hag×calla Blue/Red', () => {
  it('both open messages name Blue', () => {
    expect(hagMsg(hag())).toContain('Blue');
    expect(callaMsg(calla())).toContain('Blue');
    const hagRed = { ...hag(), currentPlayer: 'player2' as const };
    const callaRed = { ...calla(), currentPlayer: 'player2' as const };
    expect(hagMsg(hagRed)).toContain('Red');
    expect(callaMsg(callaRed)).toContain('Red');
  });
});
