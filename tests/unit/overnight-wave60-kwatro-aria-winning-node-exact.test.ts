/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro winning-node aria extras.
 * Wave56/57 cover numbered/selectable/selected; deepen winning token. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 60 kwatro — aria winning node', () => {
  it('winningAlignment node aria includes winning', () => {
    const state = createInitialState();
    state.phase = 'gameOver';
    state.winner = 'player1';
    state.winningAlignment = {
      nodes: ['n0-0'],
      chips: [],
      expression: '0 + 2 - 6 = -4',
      result: 4,
    };
    const board = renderBoard(state, () => {}, () => {});
    const cell = board.querySelector('[data-node-id="n0-0"]');
    expect(cell?.getAttribute('aria-label')).toMatch(/winning/);
    expect(cell?.getAttribute('aria-label')).toMatch(/chip 0/);
  });
});
