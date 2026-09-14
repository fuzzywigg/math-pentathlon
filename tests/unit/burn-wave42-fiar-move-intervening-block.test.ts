/**
 * Wave 42 — FIAR moveChip blocked by intervening chip. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { canMove, moveChip, getValidMoves } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function withIntervening(): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  // player1 at 1-0; intervening chip at 1-2; destination beyond at 1-4
  nodes.set('1-0', { ...nodes.get('1-0')!, chip: 'player1' });
  nodes.set('1-2', { ...nodes.get('1-2')!, chip: 'player2' });
  nodes.set('3-0', { ...nodes.get('3-0')!, chip: 'player1' });
  nodes.set('3-1', { ...nodes.get('3-1')!, chip: 'player1' });
  nodes.set('3-2', { ...nodes.get('3-2')!, chip: 'player1' });
  nodes.set('4-0', { ...nodes.get('4-0')!, chip: 'player2' });
  nodes.set('4-1', { ...nodes.get('4-1')!, chip: 'player2' });
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

describe('Wave 42 fiar — intervening block', () => {
  it('cannot jump past intervening chip to far cell', () => {
    const state = withIntervening();
    expect(canMove(state, '1-0', '1-4')).toBe(false);
    expect(getValidMoves(state, '1-0')).not.toContain('1-4');
    expect(getValidMoves(state, '1-0')).not.toContain('1-3');
  });

  it('moveChip to beyond-block destination is identity', () => {
    const state = withIntervening();
    expect(moveChip(state, '1-0', '1-4')).toBe(state);
  });

  it('can still step onto empty cell before the intervening chip', () => {
    const state = withIntervening();
    expect(canMove(state, '1-0', '1-1')).toBe(true);
    expect(getValidMoves(state, '1-0')).toContain('1-1');
    expect(getValidMoves(state, '1-0')).not.toContain('1-2');
  });
});
