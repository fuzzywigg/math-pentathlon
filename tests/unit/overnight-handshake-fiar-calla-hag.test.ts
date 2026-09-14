/**
 * Overnight TOKENMAXX — fiar×calla×hag openings leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';
import { createInitialState as hagInit } from '../../src/games/hex-a-gone/types';
import { canPlayerMove } from '../../src/games/hex-a-gone/rules';

describe('Overnight handshake — fiar×calla×hag', () => {
  it('opening legal actions exist', () => {
    expect(canPlaceChip(fiarInit(), '2-2')).toBe(true);
    expect(getValidPits(callaInit())).toHaveLength(5);
    expect(canPlayerMove(hagInit())).toBe(true);
  });
});
