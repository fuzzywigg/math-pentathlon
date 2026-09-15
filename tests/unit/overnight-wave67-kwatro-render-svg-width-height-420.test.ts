/**
 * Wave 67 leftover after tip/#324 — Kwatro SVG width/height 420.
 * Wave55 locks viewBox; deepen width/height leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 67 kwatro — render svg width height 420', () => {
  it('svg locks width and height 420', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const svg = el.querySelector('svg.kwa-svg');
    expect(svg?.getAttribute('width')).toBe('420');
    expect(svg?.getAttribute('height')).toBe('420');
  });
});
