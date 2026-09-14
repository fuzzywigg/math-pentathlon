/**
 * Wave 42 — FIAR canMove / moveChip success along a clear row. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { canMove, moveChip, getValidMoves } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function forgedMovement(): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  // player1 chip at left of row 2; rest of row empty
  nodes.set('2-0', { ...nodes.get('2-0')!, chip: 'player1' });
  nodes.set('0-0', { ...nodes.get('0-0')!, chip: 'player1' });
  nodes.set('0-1', { ...nodes.get('0-1')!, chip: 'player1' });
  nodes.set('0-2', { ...nodes.get('0-2')!, chip: 'player1' });
  nodes.set('4-0', { ...nodes.get('4-0')!, chip: 'player2' });
  nodes.set('4-1', { ...nodes.get('4-1')!, chip: 'player2' });
  nodes.set('4-2', { ...nodes.get('4-2')!, chip: 'player2' });
  nodes.set('4-3', { ...nodes.get('4-3')!, chip: 'player2' });
  return {
    ...state,
    board: { ...state.board, nodes },
    phase: 'movement',
    currentPlayer: 'player1',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
  };
}

describe('Wave 42 fiar — move along row', () => {
  it('canMove true for clear horizontal step from 2-0 to 2-1', () => {
    const state = forgedMovement();
    expect(getValidMoves(state, '2-0')).toContain('2-1');
    expect(canMove(state, '2-0', '2-1')).toBe(true);
  });

  it('moveChip relocates chip along the row and flips seat', () => {
    const state = forgedMovement();
    const next = moveChip(state, '2-0', '2-2');
    expect(next).not.toBe(state);
    expect(next.board.nodes.get('2-0')?.chip).toBeNull();
    expect(next.board.nodes.get('2-2')?.chip).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.at(-1)?.type).toBe('move');
  });

  it('farther clear row cells are also valid targets', () => {
    const state = forgedMovement();
    const moves = getValidMoves(state, '2-0');
    expect(moves).toEqual(expect.arrayContaining(['2-1', '2-2', '2-3', '2-4']));
  });
});
