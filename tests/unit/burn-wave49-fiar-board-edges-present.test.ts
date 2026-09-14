/**
 * Wave 49 — FIAR edge lines leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — edges', () => {
  it('draws one line per board edge', () => {
    const s = createInitialState();
    const svg = renderBoard(s, () => undefined);
    const lines = svg.querySelectorAll('line');
    expect(lines.length).toBe(s.board.edges.length);
    expect(lines[0]?.getAttribute('stroke-width')).toBe(String(CONFIG.EDGE_STROKE));
  });
});
