/**
 * Wave 64 leftover after tip/#306 — Kwatro svg width/height 420.
 * Wave55 locked viewBox; deepen width/height leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — render svg width height', () => {
  it('kwa-svg width and height are 420', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const svg = el.querySelector('svg.kwa-svg');
    expect(svg?.getAttribute('width')).toBe('420');
    expect(svg?.getAttribute('height')).toBe('420');
  });
});
