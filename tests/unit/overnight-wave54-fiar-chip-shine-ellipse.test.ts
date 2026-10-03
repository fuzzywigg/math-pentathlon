/**
 * Wave 54 leftover after #237 — FIAR chip shine ellipse leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — chip shine', () => {
  it('occupied chip draws shine ellipse rx 6 ry 4', () => {
    const base = createInitialState();
    const n = base.board.nodes.get('c3r3')!;
    base.board.nodes.set('c3r3', { ...n, chip: 'player1' });
    const svg = renderBoard(base, () => undefined);
    const g = svg.querySelector('[data-node-id="c3r3"]')!;
    const shine = g.querySelector('ellipse')!;
    expect(shine.getAttribute('rx')).toBe('6');
    expect(shine.getAttribute('ry')).toBe('4');
    expect(shine.getAttribute('fill')).toBe('rgba(255,255,255,0.3)');
  });
});
