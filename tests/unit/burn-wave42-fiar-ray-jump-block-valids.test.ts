/**
 * Wave 42 — FIAR mid-ray occupied stops getValidMoves (no jump). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getValidMoves, canMove } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
  type Player,
} from '../../src/games/fiar/types';

function forgeMovement(chips: Record<string, Player>): FiarGameState {
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
    currentPlayer: 'player1',
  };
}

describe('Wave 42 fiar — ray jump / block valids', () => {
  it('horizontal mid-ray chip stops further targets', () => {
    const state = forgeMovement({
      '0-0': 'player1',
      '0-2': 'player2', // blocker mid-row
      '2-0': 'player1',
      '2-1': 'player1',
      '2-2': 'player1',
      '4-0': 'player2',
      '4-1': 'player2',
      '4-2': 'player2',
    });
    const moves = getValidMoves(state, '0-0');
    expect(moves).toContain('0-1');
    expect(moves).not.toContain('0-2');
    expect(moves).not.toContain('0-3');
    expect(moves).not.toContain('0-4');
    expect(canMove(state, '0-0', '0-3')).toBe(false);
  });

  it('vertical mid-ray occupied blocks beyond', () => {
    const state = forgeMovement({
      '0-2': 'player1',
      '2-2': 'player2',
      '0-0': 'player1',
      '0-4': 'player1',
      '1-4': 'player1',
      '4-0': 'player2',
      '4-1': 'player2',
      '4-3': 'player2',
    });
    const moves = getValidMoves(state, '0-2');
    expect(moves).toContain('1-2');
    expect(moves).not.toContain('2-2');
    expect(moves).not.toContain('3-2');
    expect(moves).not.toContain('4-2');
  });

  it('diagonal mid-ray occupied blocks beyond', () => {
    const state = forgeMovement({
      '0-0': 'player1',
      '2-2': 'player2',
      '0-4': 'player1',
      '1-4': 'player1',
      '3-4': 'player1',
      '4-0': 'player2',
      '4-1': 'player2',
      '4-3': 'player2',
    });
    const moves = getValidMoves(state, '0-0');
    expect(moves).toContain('1-1');
    expect(moves).not.toContain('2-2');
    expect(moves).not.toContain('3-3');
    expect(moves).not.toContain('4-4');
  });

  it('open ray includes distant empty cells until edge', () => {
    const state = forgeMovement({
      '2-0': 'player1',
      '0-4': 'player1',
      '1-4': 'player1',
      '3-4': 'player1',
      '4-1': 'player2',
      '4-2': 'player2',
      '4-3': 'player2',
      '4-4': 'player2',
    });
    const moves = getValidMoves(state, '2-0');
    expect(moves).toContain('2-1');
    expect(moves).toContain('2-2');
    expect(moves).toContain('2-3');
    expect(moves).toContain('2-4');
  });
});
