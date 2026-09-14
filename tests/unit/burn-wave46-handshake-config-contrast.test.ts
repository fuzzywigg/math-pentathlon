/**
 * Wave 46 — Handshake CONFIG contrast leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG as parCfg } from '../../src/games/par-55/types';
import { CONFIG as primeCfg } from '../../src/games/prime-gold/types';
import { BOARD_SIZE as pentBoard } from '../../src/games/pent-em-in/types';
import { CONFIG as kwaCfg } from '../../src/games/kwatro-sinko/types';

describe('Wave 46 handshake — config contrast', () => {
  it('four engines expose distinct win targets / sizes', () => {
    expect(parCfg.TARGET_SCORE).toBe(55);
    expect(primeCfg.VEINS_TO_WIN).toBe(4);
    expect(pentBoard).toBe(10);
    expect(kwaCfg.TARGET_VALUES).toContain(4);
  });
});
