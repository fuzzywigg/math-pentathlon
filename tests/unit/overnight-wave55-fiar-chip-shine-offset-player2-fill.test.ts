/**
 * Wave 55 leftover after #249/#250 — FIAR shine offset + player2 fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard, getPlayerColor } from '../../src/games/fiar/board-ui';

describe('Wave 55 fiar — shine offset player2 fill', () => {
  it('shine is offset -4,-4; player2 chip uses seat color', () => {
    const base = createInitialState();
    const n = base.board.nodes.get('1-1')!;
    base.board.nodes.set('1-1', { ...n, chip: 'player2' });
    const svg = renderBoard(base, () => undefined);
    const g = svg.querySelector('[data-node-id="1-1"]')!;
    const shine = g.querySelector('ellipse')!;
    expect(shine.getAttribute('cx')).toBe(String(n.x - 4));
    expect(shine.getAttribute('cy')).toBe(String(n.y - 4));
    const chip = [...g.querySelectorAll('circle')].find(
      (c) => c.getAttribute('stroke') === '#fff'
    );
    expect(chip?.getAttribute('fill')).toBe(getPlayerColor('player2'));
  });
});
