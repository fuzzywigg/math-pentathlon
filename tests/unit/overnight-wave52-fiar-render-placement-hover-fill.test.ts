/**
 * Wave 52 — FIAR placement hover fill leftover. Tests-only.
 * Distinct from #235 valid #4caf50 and #236 winning/blocked strokes.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 52 fiar — placement hover fill', () => {
  it('fills empty placement nodes with #c9baa0', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const node = svg.querySelector('[data-node-id] > circle')!;
    expect(node.getAttribute('fill')).toBe('#c9baa0');
  });
});
