/**
 * Wave 42 — FIAR canPlaceChip / getValidMoves empty on gameOver. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canPlaceChip,
  getValidMoves,
  placeChip,
  moveChip,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function gameOverState(): FiarGameState {
  const base = createInitialState();
  const nodes = new Map(base.board.nodes);
  for (const col of [0, 1, 2, 3]) {
    const id = `0-${col}`;
    nodes.set(id, { ...nodes.get(id)!, chip: 'player1' });
  }
  for (const col of [0, 1, 2, 3]) {
    const id = `4-${col}`;
    nodes.set(id, { ...nodes.get(id)!, chip: 'player2' });
  }
  return {
    ...base,
    board: { ...base.board, nodes },
    phase: 'gameOver',
    winner: 'player1',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer: 'player2',
  };
}

describe('Wave 42 fiar — phase gameOver gates', () => {
  it('canPlaceChip false on every empty node when gameOver', () => {
    const state = gameOverState();
    for (const [id, node] of state.board.nodes) {
      if (node.chip === null) {
        expect(canPlaceChip(state, id)).toBe(false);
      }
    }
    expect(placeChip(state, '2-2')).toBe(state);
  });

  it('getValidMoves empty for own chips on gameOver', () => {
    const state = gameOverState();
    for (const [id, node] of state.board.nodes) {
      if (node.chip === state.currentPlayer) {
        expect(getValidMoves(state, id)).toEqual([]);
      }
    }
  });

  it('moveChip identity on gameOver even for adjacent empty', () => {
    const state = gameOverState();
    // player2 seat; try sliding a p2 chip
    expect(moveChip(state, '4-0', '3-0')).toBe(state);
  });

  it('forged gameOver with chips remaining still rejects place', () => {
    const state: FiarGameState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player2',
      chipsPlaced: { player1: 1, player2: 1 },
    };
    const id = [...state.board.nodes.keys()][0];
    expect(canPlaceChip(state, id)).toBe(false);
    expect(getValidMoves(state, id)).toEqual([]);
  });
});
