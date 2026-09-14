/**
 * Wave 55 leftover after #250 — Kwatro numbered vs empty node fill palette. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 55 kwatro — node fills', () => {
  it('middle empty node is #f5f5f5 / #ccc', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const mid = el.querySelector('[data-node-id="n2-2"] circle');
    expect(mid?.getAttribute('fill')).toBe('#f5f5f5');
    expect(mid?.getAttribute('stroke')).toBe('#ccc');
  });
});
