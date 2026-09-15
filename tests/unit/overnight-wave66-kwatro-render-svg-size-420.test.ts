/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro SVG width/height 420.
 * Wave55 locks viewBox 0 0 420 420; deepen width/height attrs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render svg size 420', () => {
  it('svg width and height are 420', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const svg = el.querySelector('svg.kwa-svg');
    expect(svg?.getAttribute('width')).toBe('420');
    expect(svg?.getAttribute('height')).toBe('420');
  });
});
