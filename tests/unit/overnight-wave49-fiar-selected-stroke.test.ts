/**
 * Wave 49 — FIAR selected stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — selected stroke', () => {
  it('uses #ff9800 stroke width 4 on selected chip node', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      selectedNode: '0-0',
      board: (() => {
        const b = createInitialState().board;
        const n = b.nodes.get('0-0')!;
        b.nodes.set('0-0', { ...n, chip: 'player1' });
        return b;
      })(),
    };
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector('[data-node-id="0-0"]')!;
    const bg = [...g.querySelectorAll('circle')].find(
      (c) =>
        !c.classList.contains('pulse-highlight') &&
        Number(c.getAttribute('r')) === CONFIG.NODE_RADIUS
    )!;
    expect(bg.getAttribute('stroke')).toBe('#ff9800');
    expect(bg.getAttribute('stroke-width')).toBe('4');
  });
});
