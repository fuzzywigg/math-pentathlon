/**
 * Wave 68 leftover after tip/#336 — Kwatro svg.kwa-svg class.
 * Width/height covered; deepen class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 68 kwatro — render svg classname', () => {
  it('svg exposes kwa-svg class', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    expect(el.querySelector('svg')?.classList.contains('kwa-svg')).toBe(true);
  });
});
