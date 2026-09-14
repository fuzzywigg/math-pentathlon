/**
 * Wave 49 — FIAR viewBox padding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — viewBox padding', () => {
  it('pads viewBox beyond node bounds', () => {
    const s = createInitialState();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of s.board.nodes.values()) {
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x); maxY = Math.max(maxY, n.y);
    }
    const svg = renderBoard(s, () => undefined);
    const vb = svg.getAttribute('viewBox')!.split(/\s+/).map(Number);
    expect(vb[0]).toBe(minX - 60);
    expect(vb[1]).toBe(minY - 60);
    expect(vb[2]).toBe(maxX - minX + 120);
    expect(vb[3]).toBe(maxY - minY + 120);
  });
});
