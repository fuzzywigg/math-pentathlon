/**
 * Wave 51 leftover after #233 — FIAR valid-move fill edge. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getValidMoves } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 51 fiar — valid fill', () => {
  it('paints #4caf50 on valid movement destinations', () => {
    const base = createInitialState();
    // Place a chip and select it in movement
    const board = createInitialState().board;
    const n = board.nodes.get('c2r1')!;
    board.nodes.set('c2r1', { ...n, chip: 'player1' });
    const state = {
      ...base,
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      selectedNode: 'c2r1',
      board,
    };
    const valids = getValidMoves(state, 'c2r1');
    expect(valids.length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    const g = svg.querySelector(`[data-node-id="${valids[0]}"]`)!;
    const bg = [...g.querySelectorAll('circle')].find(
      (c) => !c.classList.contains('pulse-highlight')
    )!;
    expect(bg.getAttribute('fill')).toBe('#4caf50');
  });
});
