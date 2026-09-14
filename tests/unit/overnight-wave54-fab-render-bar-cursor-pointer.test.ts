/**
 * Wave 54 leftover after #240 — Fab selectable bar cursor leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — bar cursor', () => {
  it('opening unused bars use pointer cursor', () => {
    const el = renderFractionBarPool(createInitialState(), () => undefined);
    const wrap = el.querySelector('.fab-bar-wrapper') as HTMLElement;
    expect(wrap.style.cursor).toBe('pointer');
  });
});
