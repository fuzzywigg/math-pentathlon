/**
 * Wave 42 — FIAR checkWinner null midgame; winner after unblocked four. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkWinner,
  placeChip,
  moveChip,
  getValidMoves,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function withUnblockedFour(player: 'player1' | 'player2'): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const col of [0, 1, 2, 3]) {
    const id = `1-${col}`;
    nodes.set(id, { ...nodes.get(id)!, chip: player });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
  };
}

describe('Wave 42 fiar — checkWinner midgame', () => {
  it('checkWinner null during early placement', () => {
    let state = createInitialState();
    expect(checkWinner(state)).toBeNull();
    state = placeChip(state, '2-2');
    state = placeChip(state, '0-0');
    expect(checkWinner(state)).toBeNull();
  });

  it('unblocked four yields that player as winner', () => {
    expect(checkWinner(withUnblockedFour('player1'))).toBe('player1');
    expect(checkWinner(withUnblockedFour('player2'))).toBe('player2');
  });

  it('moveChip completing unblocked four sets gameOver + winner', () => {
    const state = createInitialState();
    const nodes = new Map(state.board.nodes);
    nodes.set('2-0', { ...nodes.get('2-0')!, chip: 'player1' });
    nodes.set('2-1', { ...nodes.get('2-1')!, chip: 'player1' });
    nodes.set('2-2', { ...nodes.get('2-2')!, chip: 'player1' });
    nodes.set('2-4', { ...nodes.get('2-4')!, chip: 'player1' });
    nodes.set('4-0', { ...nodes.get('4-0')!, chip: 'player2' });
    nodes.set('4-1', { ...nodes.get('4-1')!, chip: 'player2' });
    nodes.set('4-2', { ...nodes.get('4-2')!, chip: 'player2' });
    nodes.set('4-3', { ...nodes.get('4-3')!, chip: 'player2' });
    const ready: FiarGameState = {
      ...state,
      board: { ...state.board, nodes },
      phase: 'movement',
      currentPlayer: 'player1',
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: CONFIG.CHIPS_PER_PLAYER,
      },
    };
    expect(getValidMoves(ready, '2-4')).toContain('2-3');
    const next = moveChip(ready, '2-4', '2-3');
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
  });
});
