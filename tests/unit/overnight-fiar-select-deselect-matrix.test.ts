/**
 * Overnight HEAVY — FIAR selectChip toggle + deselectChip.
 * Distinct leftover movement chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectChip, deselectChip, getValidMoves } from '../../src/games/fiar/rules';
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

describe('Overnight fiar — select/deselect', () => {
  it('toggles selectedNode and deselect clears', () => {
    const state = movementBoard([
      { id: '2-2', chip: 'player1' },
      { id: '0-0', chip: 'player2' },
      { id: '0-1', chip: 'player2' },
      { id: '0-2', chip: 'player2' },
      { id: '0-3', chip: 'player2' },
    ]);
    expect(getValidMoves(state, '2-2').length).toBeGreaterThan(0);
    const selected = selectChip(state, '2-2');
    expect(selected.selectedNode).toBe('2-2');
    const toggled = selectChip(selected, '2-2');
    expect(toggled.selectedNode).toBeNull();
    const again = selectChip(state, '2-2');
    expect(deselectChip(again).selectedNode).toBeNull();
  });

  it('rejects select of opponent chip', () => {
    const state = movementBoard([
      { id: '1-1', chip: 'player1' },
      { id: '2-2', chip: 'player2' },
      { id: '0-4', chip: 'player2' },
      { id: '1-4', chip: 'player2' },
      { id: '3-4', chip: 'player2' },
    ]);
    expect(selectChip(state, '2-2')).toBe(state);
  });
});
