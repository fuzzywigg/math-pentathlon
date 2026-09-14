/**
 * Wave 53 leftover after #235 — Fab bar data-bar-id stamps. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar data-id', () => {
  it('stamps data-bar-id matching fractionBars keys', () => {
    const state = createInitialState();
    const el = renderFractionBarPool(state, () => undefined);
    const ids = [...el.querySelectorAll('.fab-bar-wrapper')].map((n) => (n as HTMLElement).dataset.barId);
    expect(ids.sort()).toEqual([...state.fractionBars.keys()].sort());
  });
});
