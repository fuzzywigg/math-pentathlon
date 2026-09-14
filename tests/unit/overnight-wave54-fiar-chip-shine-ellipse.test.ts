/**
 * Wave 54 leftover after #237 — FIAR chip shine ellipse leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — chip shine', () => {
  it('occupied chip draws shine ellipse rx 6 ry 4', () => {
    const base = createInitialState();
    const n = base.board.nodes.get('2-2')!;
    base.board.nodes.set('2-2', { ...n, chip: 'player1' });
    const svg = renderBoard(base, () => undefined);
    const g = svg.querySelector('[data-node-id="2-2"]')!;
    const shine = g.querySelector('ellipse')!;
    expect(shine.getAttribute('rx')).toBe('6');
    expect(shine.getAttribute('ry')).toBe('4');
    expect(shine.getAttribute('fill')).toBe('rgba(255,255,255,0.3)');
  });
});
