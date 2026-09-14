/**
 * Wave 42 — Star Track unused chain recycled to bucket. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { drawChains, selectChain, getPhaseMessage } from '../../src/games/star-track/rules';
import { createInitialState } from '../../src/games/star-track/types';

describe('Wave 42 star-track — recycle unused', () => {
  it('select index 1 returns unused chain0 to bucket', () => {
    let s = drawChains(createInitialState());
    const before = s.chainBucket.length;
    const drawn = s.drawnChains!;
    const next = selectChain(s, 1);
    expect(next.drawnChains).toBeNull();
    expect(next.chainBucket.length).toBe(before + 1);
    expect(next.chainBucket[next.chainBucket.length - 1]).toEqual(drawn[0]);
    expect(next.selectedChain).toEqual(drawn[1]);
    expect(next.phase).toBe('drawChains');
    expect(next.currentPlayer).toBe('player2');
  });

  it('phase messages for draw/select', () => {
    const open = createInitialState();
    expect(getPhaseMessage(open)).toMatch(/Draw chains/);
    const drawn = drawChains(open);
    expect(getPhaseMessage(drawn)).toMatch(/Choose a chain/);
  });
});
