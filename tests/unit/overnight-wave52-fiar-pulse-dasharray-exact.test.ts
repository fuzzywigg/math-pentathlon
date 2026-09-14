/**
 * Wave 52 — FIAR pulse dasharray exact leftover. Tests-only.
 * Beyond wave49 presence; not #235/#236 path strokes.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';
import { getSelectableNodes } from '../../src/games/fiar/rules';

describe('Wave 52 fiar — pulse dasharray', () => {
  it('sets stroke-dasharray 4 2 and #ff9800 on pulse-highlight', () => {
    const base = createInitialState();
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
    expect(getSelectableNodes(state).length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    const pulse = svg.querySelector('.pulse-highlight')!;
    expect(pulse.getAttribute('stroke-dasharray')).toBe('4 2');
    expect(pulse.getAttribute('stroke')).toBe('#ff9800');
    expect(pulse.getAttribute('fill')).toBe('none');
  });
});
