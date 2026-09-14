/**
 * Wave 52 — FIAR chip radius/stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 52 fiar — chip fill stroke', () => {
  it('draws occupied chip with NODE_RADIUS-6 and white stroke', () => {
    const base = createInitialState();
    const id = [...base.board.nodes.keys()][0]!;
    const n = base.board.nodes.get(id)!;
    base.board.nodes.set(id, { ...n, chip: 'player1' });
    const svg = renderBoard(base, () => undefined);
    const g = svg.querySelector(`[data-node-id="${id}"]`)!;
    const circles = g.querySelectorAll('circle');
    // background + chip (+ maybe pulse later); chip is second circle usually
    const chip = [...circles].find(
      (c) =>
        c.getAttribute('r') === String(CONFIG.NODE_RADIUS - 6) &&
        c.getAttribute('stroke') === '#fff'
    );
    expect(chip).toBeTruthy();
    expect(chip!.getAttribute('stroke-width')).toBe('2');
  });
});
