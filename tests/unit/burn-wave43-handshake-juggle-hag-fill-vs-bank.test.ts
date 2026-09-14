/**
 * Wave 43 — Handshake juggle fill cells vs hag bank total leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/juggle/types';
import { INITIAL_BANK, createInitialState as hag } from '../../src/games/hex-a-gone/types';

describe('Wave 43 handshake — juggle×hag inventory contrast', () => {
  it('juggle 81 cells; hag bank units distinct from board cells', () => {
    const bank = Object.values(INITIAL_BANK).reduce((a, b) => a + b, 0);
    expect(CONFIG.CELLS_TO_FILL).toBe(81);
    expect(hag().board.length).toBe(37);
    expect(bank).toBe(3 + 6 + 6 + 12 + 6);
  });
});
