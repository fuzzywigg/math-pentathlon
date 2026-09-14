/**
 * Overnight HEAVY — FIAR moveChip along diagonal is legal; does not invent diagonal win.
 * Distinct leftover vs wave42 column move-win. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { moveChip, canMove, checkWinner } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function movementBoard(
  placements: Array<{ id: string; chip: 'player1' | 'player2' }>
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const p of placements) {
    nodes.set(p.id, { ...nodes.get(p.id)!, chip: p.chip });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer: 'player1',
  };
}

describe('Overnight fiar — diagonal move legality', () => {
  it('can slide diagonally onto empty node without inventing a win', () => {
    const state = movementBoard([
      { id: '0-0', chip: 'player1' },
      { id: '1-1', chip: 'player1' },
      { id: '2-2', chip: 'player1' },
      { id: '4-4', chip: 'player1' },
      { id: '0-4', chip: 'player2' },
      { id: '1-4', chip: 'player2' },
      { id: '2-4', chip: 'player2' },
      { id: '3-4', chip: 'player2' },
    ]);
    expect(canMove(state, '4-4', '3-3')).toBe(true);
    const next = moveChip(state, '4-4', '3-3');
    expect(next.board.nodes.get('3-3')!.chip).toBe('player1');
    expect(next.board.nodes.get('4-4')!.chip).toBeNull();
    // Cardinal win scan: diagonal alignment still does not win
    expect(checkWinner(next)).toBeNull();
    expect(next.phase).toBe('movement');
    expect(next.currentPlayer).toBe('player2');
  });
});
