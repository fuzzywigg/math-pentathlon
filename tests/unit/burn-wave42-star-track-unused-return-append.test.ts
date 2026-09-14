/** Wave 42 — Star Track unused chain appended to bucket end. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';

describe('Wave 42 Star Track — unused return append', () => {
  it('unused chain is appended as the last bucket entry', () => {
    let state = drawChains(createInitialState());
    const unused = state.drawnChains![1];
    const lenBefore = state.chainBucket.length;
    state = selectChain(state, 0);
    expect(state.chainBucket).toHaveLength(lenBefore + 1);
    expect(state.chainBucket[state.chainBucket.length - 1].id).toBe(unused.id);
  });

  it('selecting index 1 appends the first drawn chain', () => {
    let state = drawChains(createInitialState());
    const unused = state.drawnChains![0];
    state = selectChain(state, 1);
    expect(state.chainBucket[state.chainBucket.length - 1].id).toBe(unused.id);
  });

  it('drawnChains cleared after append', () => {
    let state = drawChains(createInitialState());
    state = selectChain(state, 0);
    expect(state.drawnChains).toBeNull();
  });

  it('bucket grows by exactly one regardless of which index is chosen', () => {
    for (const idx of [0, 1] as const) {
      let state = drawChains(createInitialState());
      const before = state.chainBucket.length;
      state = selectChain(state, idx);
      expect(state.chainBucket.length).toBe(before + 1);
    }
  });
});
