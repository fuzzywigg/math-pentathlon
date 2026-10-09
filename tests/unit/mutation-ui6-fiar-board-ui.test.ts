/**
 * q-mp-231 mutation audit UI wave 6 — kill survivors in games/fiar/board-ui.
 * Structural / geometry pins only — no player-facing copy asserts.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { renderBoard } from '../../src/games/fiar/board-ui';
import { createInitialState } from '../../src/games/fiar/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('mutation-ui6 fiar board-ui', () => {
  it('background rect x/y use min − padding (kills L92/L93 − → +)', () => {
    // Survivors: bg.setAttribute x/y `(minX - padding)` / `(minY - padding)` → +.
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
    const bg = svg.querySelector('rect');
    expect(bg).toBeTruthy();
    expect(bg?.getAttribute('x')).toBe(String(minX - padding));
    expect(bg?.getAttribute('y')).toBe(String(minY - padding));
    expect(bg?.getAttribute('width')).toBe(String(width));
    expect(bg?.getAttribute('height')).toBe(String(height));
    // Cross-check: x must be strictly less than every node.x (padding inset).
    expect(Number(bg?.getAttribute('x'))).toBeLessThan(minX);
    expect(Number(bg?.getAttribute('y'))).toBeLessThan(minY);
  });
});
