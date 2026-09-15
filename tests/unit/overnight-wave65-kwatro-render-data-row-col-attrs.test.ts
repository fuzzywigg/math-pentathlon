/**
 * Wave 65 leftover after tip/#315 — Kwatro node data-row/data-col attrs.
 * data-node-id covered; deepen row/col leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 65 kwatro — render data-row col attrs', () => {
  it('nodes expose data-row and data-col from id', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const node = el.querySelector('[data-node-id="n3-1"]');
    expect(node?.getAttribute('data-row')).toBe('3');
    expect(node?.getAttribute('data-col')).toBe('1');
  });
});
