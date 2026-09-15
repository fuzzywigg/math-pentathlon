/**
 * Wave 68 leftover after tip/#336 — Kwatro edge line stroke #999 width 2.
 * Wave51 count only; deepen stroke attrs leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 68 kwatro — render edge stroke 999', () => {
  it('connection lines use stroke #999 width 2', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const line = el.querySelector('line');
    expect(line?.getAttribute('stroke')).toBe('#999');
    expect(line?.getAttribute('stroke-width')).toBe('2');
  });
});
