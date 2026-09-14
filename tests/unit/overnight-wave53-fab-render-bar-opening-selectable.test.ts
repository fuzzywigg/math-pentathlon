/**
 * Wave 53 leftover after #235 — Fab opening bars selectable. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — opening selectable', () => {
  it('opening wrappers are not disabled and have pointer cursor', () => {
    const el = renderFractionBarPool(createInitialState(), () => undefined);
    const wraps = [...el.querySelectorAll('.fab-bar-wrapper')] as HTMLElement[];
    expect(wraps.every((w) => !w.classList.contains('fab-bar-disabled'))).toBe(true);
    expect(wraps.every((w) => w.style.cursor === 'pointer')).toBe(true);
  });
});
