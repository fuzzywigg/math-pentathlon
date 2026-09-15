/**
 * Wave 66 leftover after tip/#316 — Kwatro data-row/col attrs exact.
 * Soft data-node-id; deepen row/col leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render data-row-col attrs', () => {
  it('n3-1 exposes data-row 3 and data-col 1', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const node = el.querySelector('[data-node-id="n3-1"]');
    expect(node?.getAttribute('data-row')).toBe('3');
    expect(node?.getAttribute('data-col')).toBe('1');
  });
});
