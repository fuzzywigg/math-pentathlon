/**
 * Wave 42 — FIAR moveChip completing unblocked 4 settles winner + gameOver. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { moveChip, canMove, checkWinner } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
  type Player,
} from '../../src/games/fiar/types';

function forgeMovement(
  chips: Record<string, Player>,
  currentPlayer: Player = 'player1'
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const [id, chip] of Object.entries(chips)) {
    nodes.set(id, { ...nodes.get(id)!, chip });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer,
    winner: null,
  };
}

describe('Wave 42 fiar — moveChip win settle', () => {
  it('move completing unblocked row of 4 → winner + gameOver', () => {
    // Three on row 0; fourth chip at 2-3 can slide vertically to 0-3
    const state = forgeMovement({
      '0-0': 'player1',
      '0-1': 'player1',
      '0-2': 'player1',
      '2-3': 'player1',
      '4-0': 'player2',
      '4-1': 'player2',
      '4-2': 'player2',
      '4-4': 'player2',
    });
    expect(checkWinner(state)).toBeNull();
    expect(canMove(state, '2-3', '0-3')).toBe(true);
    const next = moveChip(state, '2-3', '0-3');
    expect(next).not.toBe(state);
    expect(next.board.nodes.get('0-3')?.chip).toBe('player1');
    expect(next.board.nodes.get('2-3')?.chip).toBeNull();
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
  });

  it('non-winning legal move leaves winner null and stays in movement', () => {
    // Scatter both sides — no pre-existing WIN_LENGTH for either player
    const state = forgeMovement({
      '0-0': 'player1',
      '1-0': 'player1',
      '0-4': 'player1',
      '2-4': 'player1',
      '4-0': 'player2',
      '4-2': 'player2',
      '3-4': 'player2',
      '4-4': 'player2',
    });
    expect(checkWinner(state)).toBeNull();
    expect(canMove(state, '0-0', '0-1')).toBe(true);
    const next = moveChip(state, '0-0', '0-1');
    expect(next.phase).toBe('movement');
    expect(next.winner).toBeNull();
    expect(next.currentPlayer).toBe('player2');
  });

  it('illegal move that would "complete" four is identity', () => {
    const state = forgeMovement({
      '0-0': 'player1',
      '0-1': 'player1',
      '0-2': 'player1',
      '3-4': 'player1',
      '4-0': 'player2',
      '4-1': 'player2',
      '4-2': 'player2',
      '4-3': 'player2',
    });
    // 3-4 cannot jump to 0-3 (not on a clear ray from origin)
    expect(canMove(state, '3-4', '0-3')).toBe(false);
    expect(moveChip(state, '3-4', '0-3')).toBe(state);
  });

  it('blocked four after move does not settle gameOver', () => {
    // Completing 0-0..0-3 but opponent sits adjacent at 1-1 → blocked path
    const state = forgeMovement({
      '0-0': 'player1',
      '0-1': 'player1',
      '0-2': 'player1',
      '2-3': 'player1',
      '1-1': 'player2',
      '4-0': 'player2',
      '4-2': 'player2',
      '4-4': 'player2',
    });
    const next = moveChip(state, '2-3', '0-3');
    expect(next.board.nodes.get('0-3')?.chip).toBe('player1');
    expect(next.winner).toBeNull();
    expect(next.phase).toBe('movement');
  });
});
