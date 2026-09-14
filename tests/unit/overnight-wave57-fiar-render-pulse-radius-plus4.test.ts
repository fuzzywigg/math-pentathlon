/**
 * Wave 57 leftover after #257 — FIAR pulse-highlight radius NODE_RADIUS+4. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';
import { getSelectableNodes } from '../../src/games/fiar/rules';

describe('Wave 57 fiar — pulse radius plus4', () => {
  it('pulse-highlight r equals NODE_RADIUS + 4', () => {
    const base = createInitialState();
    const board = base.board;
    const ids = [...board.nodes.keys()].slice(0, 8);
    ids.slice(0, 4).forEach((id) => {
      board.nodes.set(id, { ...board.nodes.get(id)!, chip: 'player1' });
    });
    ids.slice(4, 8).forEach((id) => {
      board.nodes.set(id, { ...board.nodes.get(id)!, chip: 'player2' });
    });
    const state = {
      ...base,
      board,
      phase: 'movement' as const,
      chipsPlaced: { player1: 4, player2: 4 },
      currentPlayer: 'player1' as const,
    };
    expect(getSelectableNodes(state).length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    const pulse = svg.querySelector('.pulse-highlight')!;
    expect(pulse.getAttribute('r')).toBe(String(CONFIG.NODE_RADIUS + 4));
    expect(CONFIG.NODE_RADIUS + 4).toBe(28);
  });
});
