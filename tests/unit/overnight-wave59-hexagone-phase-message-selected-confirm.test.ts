/**
 * Wave 59 leftover after #276 — Hex-a-Gone exact mid-select phase message. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, getPhaseMessage } from '../../src/games/hex-a-gone/rules';

describe('Wave 59 hexagone — phase selected confirm exact', () => {
  it('exact Blue mid-select confirm cue after one triangle', () => {
    const state = selectBlock(createInitialState(), 'triangle');
    expect(getPhaseMessage(state)).toBe(
      'Blue: 1 block(s) selected. Select more or confirm.'
    );
  });
});
