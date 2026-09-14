/**
 * Wave 56 leftover after #255/#256 — FIAR inject status font / empty node fill. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles, renderBoard } from '../../src/games/fiar/board-ui';
import { createInitialState } from '../../src/games/fiar/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 fiar — inject status font + empty node', () => {
  it('CSS includes status font-size 1.2rem and weight 500', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-status');
    expect(css).toContain('font-size: 1.2rem');
    expect(css).toContain('font-weight: 500');
    expect(css).toContain('.fiar-chip-icon.player1');
    expect(css).toContain('.fiar-chip-icon.player2');
  });

  it('movement empty non-valid node uses #dcd0c0 fill', () => {
    const state = createInitialState();
    state.phase = 'movement';
    state.chipsPlaced = { player1: 4, player2: 4 };
    for (const [id, n] of state.board.nodes) {
      state.board.nodes.set(id, { ...n, chip: null });
    }
    state.board.nodes.set('0-0', {
      ...state.board.nodes.get('0-0')!,
      chip: 'player1',
    });
    state.board.nodes.set('4-4', {
      ...state.board.nodes.get('4-4')!,
      chip: 'player2',
    });
    state.currentPlayer = 'player1';
    state.selectedNode = null;

    const svg = renderBoard(state, () => undefined);
    const empty = svg.querySelector(
      '[data-node-id="2-2"] circle'
    ) as SVGCircleElement | null;
    expect(empty?.getAttribute('fill')).toBe('#dcd0c0');
  });
});
