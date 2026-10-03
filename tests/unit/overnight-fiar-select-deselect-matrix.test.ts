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
      { id: 'c3r3', chip: 'player1' },
      { id: 'c2r1', chip: 'player2' },
      { id: 'c3r1', chip: 'player2' },
      { id: 'c4r1', chip: 'player2' },
      { id: 'c5r1', chip: 'player2' },
    ]);
    expect(getValidMoves(state, 'c3r3').length).toBeGreaterThan(0);
    const selected = selectChip(state, 'c3r3');
    expect(selected.selectedNode).toBe('c3r3');
    const toggled = selectChip(selected, 'c3r3');
    expect(toggled.selectedNode).toBeNull();
    const again = selectChip(state, 'c3r3');
    expect(deselectChip(again).selectedNode).toBeNull();
  });

  it('rejects select of opponent chip', () => {
    const state = movementBoard([
      { id: 'c3r2', chip: 'player1' },
      { id: 'c3r3', chip: 'player2' },
      { id: 'c6r1', chip: 'player2' },
      { id: 'c6r2', chip: 'player2' },
      { id: 'c6r4', chip: 'player2' },
    ]);
    expect(selectChip(state, 'c3r3')).toBe(state);
  });
});
