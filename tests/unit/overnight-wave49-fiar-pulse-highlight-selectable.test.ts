/**
 * Wave 49 — FIAR pulse-highlight on selectable leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';
import { getSelectableNodes } from '../../src/games/fiar/rules';

describe('Wave 49 fiar — pulse-highlight', () => {
  it('draws pulse-highlight on selectable movement chips', () => {
    const base = createInitialState();
    // Place 4 chips each to enter movement-like selectable state via forge
    const board = base.board;
    const ids = [...board.nodes.keys()].slice(0, 8);
    ids.slice(0, 4).forEach((id) => {
      const n = board.nodes.get(id)!;
      board.nodes.set(id, { ...n, chip: 'player1' });
    });
    ids.slice(4, 8).forEach((id) => {
      const n = board.nodes.get(id)!;
      board.nodes.set(id, { ...n, chip: 'player2' });
    });
    const state = {
      ...base,
      board,
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      currentPlayer: 'player1' as const,
    };
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    expect(svg.querySelectorAll('.pulse-highlight').length).toBeGreaterThan(0);
  });
});
