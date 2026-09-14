/**
 * Wave 57 leftover after #257 — FIAR valid-move stroke-width 3. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getValidMoves } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 57 fiar — valid stroke-width 3', () => {
  it('paints stroke-width 3 on valid movement destinations', () => {
    const base = createInitialState();
    const board = createInitialState().board;
    board.nodes.set('0-0', {
      ...board.nodes.get('0-0')!,
      chip: 'player1',
    });
    const state = {
      ...base,
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      selectedNode: '0-0',
      board,
    };
    const valids = getValidMoves(state, '0-0');
    expect(valids.length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector(`[data-node-id="${valids[0]}"]`)!;
    const bg = [...g.querySelectorAll('circle')].find(
      (c) => !c.classList.contains('pulse-highlight')
    )!;
    expect(bg.getAttribute('stroke-width')).toBe('3');
    expect(bg.getAttribute('fill')).toBe('#4caf50');
  });
});
