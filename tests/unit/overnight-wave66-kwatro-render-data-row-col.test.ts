/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro data-row/data-col attrs.
 * Wave56 locks aria numbered; deepen grid data-row/col on opening nodes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render data-row/col', () => {
  it('opening nodes expose data-row and data-col', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const n00 = el.querySelector('[data-node-id="n0-0"]');
    const n22 = el.querySelector('[data-node-id="n2-2"]');
    expect(n00?.getAttribute('data-row')).toBe('0');
    expect(n00?.getAttribute('data-col')).toBe('0');
    expect(n22?.getAttribute('data-row')).toBe('2');
    expect(n22?.getAttribute('data-col')).toBe('2');
  });
});
