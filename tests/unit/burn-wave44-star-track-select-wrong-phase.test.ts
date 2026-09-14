/**
 * Wave 44 — Star Track selectChain wrong-phase leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { selectChain, drawChains } from '../../src/games/star-track/rules';

describe('Wave 44 Star Track — select wrong phase', () => {
  it('identity when not selectChain or drawn null', () => {
    const s = createInitialState();
    expect(selectChain(s, 0)).toEqual(s);
    expect(drawChains({ ...s, phase: 'selectChain' })).toEqual({
      ...s,
      phase: 'selectChain',
    });
    expect(
      selectChain({ ...s, phase: 'selectChain', drawnChains: null }, 1)
    ).toEqual({ ...s, phase: 'selectChain', drawnChains: null });
  });
});
