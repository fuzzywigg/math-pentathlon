/**
 * Wave 43 — Handshake hag last-mover vs ramrod score threshold. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG as RAMROD_CFG } from '../../src/games/ramrod/types';
import { createInitialState as hag } from '../../src/games/hex-a-gone/types';
import { INITIAL_BANK } from '../../src/games/hex-a-gone/types';

describe('Wave 43 handshake — hag×ramrod win contrast', () => {
  it('ramrod targets score; hag starts with bank inventory', () => {
    expect(RAMROD_CFG.TARGET_SCORE).toBe(24);
    const bankTotal = Object.values(INITIAL_BANK).reduce((a, b) => a + b, 0);
    expect(bankTotal).toBeGreaterThan(RAMROD_CFG.TARGET_SCORE);
    expect(hag().phase).toBe('selectBlocks');
  });
});
