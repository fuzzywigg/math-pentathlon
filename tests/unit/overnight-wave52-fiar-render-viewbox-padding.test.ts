/**
 * Wave 52 — FIAR viewBox padding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 52 fiar — viewBox padding', () => {
  it('pads node bounds by 60 on each side', () => {
    const state = createInitialState();
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of state.board.nodes.values()) {
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
    }
    const padding = 60;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    const svg = renderBoard(state, () => undefined);
    expect(svg.getAttribute('viewBox')).toBe(
      `${minX - padding} ${minY - padding} ${width} ${height}`
    );
  });
});
