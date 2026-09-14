/**
 * Wave 42 — FIAR vertical + diagonal WIN_LENGTH paths / checkWinner. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { findPaths, checkWinner } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
  type Player,
} from '../../src/games/fiar/types';

function forge(
  chips: Record<string, Player>,
  phase: FiarGameState['phase'] = 'movement'
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const [id, chip] of Object.entries(chips)) {
    nodes.set(id, { ...nodes.get(id)!, chip });
  }
  return {
    ...state,
    board: { ...state.board, nodes },
    phase,
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
  };
}

describe('Wave 42 fiar — vertical / diagonal paths', () => {
  it('vertical column of four unblocked → player1 wins', () => {
    const state = forge({
      '0-2': 'player1',
      '1-2': 'player1',
      '2-2': 'player1',
      '3-2': 'player1',
      '4-0': 'player2',
      '4-1': 'player2',
      '4-3': 'player2',
      '4-4': 'player2',
    });
    const paths = findPaths(state, 'player1');
    expect(
      paths.some(
        (p) => !p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH
      )
    ).toBe(true);
    expect(checkWinner(state)).toBe('player1');
  });

  it('diagonal down-right of four unblocked → player2 wins', () => {
    const state = forge({
      '0-0': 'player2',
      '1-1': 'player2',
      '2-2': 'player2',
      '3-3': 'player2',
      '0-4': 'player1',
      '1-4': 'player1',
      '2-4': 'player1',
      '3-4': 'player1',
    });
    const paths = findPaths(state, 'player2');
    expect(
      paths.some(
        (p) =>
          !p.isBlocked &&
          p.nodes.length >= CONFIG.WIN_LENGTH &&
          p.nodes.includes('0-0') &&
          p.nodes.includes('3-3')
      )
    ).toBe(true);
    expect(checkWinner(state)).toBe('player2');
  });

  it('diagonal down-left of four unblocked wins', () => {
    const state = forge({
      '0-3': 'player1',
      '1-2': 'player1',
      '2-1': 'player1',
      '3-0': 'player1',
      '4-1': 'player2',
      '4-2': 'player2',
      '4-3': 'player2',
      '4-4': 'player2',
    });
    expect(checkWinner(state)).toBe('player1');
  });

  it('vertical three never wins; short diagonal null', () => {
    const vertical3 = forge({
      '0-1': 'player1',
      '1-1': 'player1',
      '2-1': 'player1',
      '0-4': 'player2',
      '1-4': 'player2',
      '2-4': 'player2',
    });
    expect(
      findPaths(vertical3, 'player1').every(
        (p) => p.nodes.length < CONFIG.WIN_LENGTH
      )
    ).toBe(true);
    expect(checkWinner(vertical3)).toBeNull();

    const diag2 = forge({
      '0-0': 'player2',
      '1-1': 'player2',
      '3-0': 'player1',
      '3-1': 'player1',
    });
    expect(checkWinner(diag2)).toBeNull();
  });
});
