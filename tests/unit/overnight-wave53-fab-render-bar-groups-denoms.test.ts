/**
 * Wave 53 leftover after #235 — Fab bar denom groups. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar groups', () => {
  it('groups wrappers under .fab-bar-group by denominator', () => {
    const el = renderFractionBarPool(createInitialState(), () => undefined);
    const groups = el.querySelectorAll('.fab-bar-group');
    expect(groups.length).toBeGreaterThanOrEqual(2);
    expect(el.querySelectorAll('.fab-bar-wrapper').length).toBeGreaterThan(10);
    for (const g of groups) {
      expect(g.querySelectorAll('.fab-bar-wrapper').length).toBeGreaterThan(0);
    }
  });
});
