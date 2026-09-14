/**
 * Wave 42 — FIAR vertical + diagonal WIN_LENGTH paths / checkWinner. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { findPaths, checkWinner, isPathBlocked } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  getNodesInDirection,
  getDirections,
  type FiarGameState,
  type Player,
} from '../../src/games/fiar/types';

function forge(chips: Record<string, Player>): FiarGameState {
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
  };
}

describe('Wave 42 fiar — vertical / diagonal paths', () => {
  it('vertical column of four unblocked → player1 wins', () => {
    const state = forge({
      '0-2': 'player1',
      '1-2': 'player1',
      '2-2': 'player1',
      '3-2': 'player1',
      '0-4': 'player2',
      '1-4': 'player2',
      '2-4': 'player2',
      '4-4': 'player2',
    });
    const path = ['0-2', '1-2', '2-2', '3-2'];
    expect(isPathBlocked(state, path, 'player1')).toBe(false);
    expect(
      findPaths(state, 'player1').some(
        (p) => !p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH
      )
    ).toBe(true);
    expect(checkWinner(state)).toBe('player1');
  });

  it('down-right diagonal ray has WIN_LENGTH nodes via getNodesInDirection', () => {
    const state = createInitialState();
    const dirs = getDirections();
    const downRight = dirs.find((d) => d.dx > 0 && d.dy > 0)!;
    const ray = getNodesInDirection(state.board, '0-0', downRight.dx, downRight.dy);
    expect(ray.length).toBeGreaterThanOrEqual(CONFIG.WIN_LENGTH);
    expect(ray.slice(0, 4)).toEqual(['1-1', '2-2', '3-3', '4-4']);
  });

  it('down-left diagonal ray has WIN_LENGTH nodes; chips alone do not win via H/V findPaths', () => {
    const state = forge({
      '0-3': 'player1',
      '1-2': 'player1',
      '2-1': 'player1',
      '3-0': 'player1',
      '0-0': 'player2',
      '3-4': 'player2',
      '4-2': 'player2',
      '4-4': 'player2',
    });
    const dirs = getDirections();
    const downLeft = dirs.find((d) => d.dx < 0 && d.dy > 0)!;
    const ray = getNodesInDirection(state.board, '0-3', downLeft.dx, downLeft.dy);
    expect(ray).toEqual(['1-2', '2-1', '3-0']);
    expect(1 + ray.length).toBeGreaterThanOrEqual(CONFIG.WIN_LENGTH);
    // findPaths only walks halfDirs = first 4 (axis-aligned), so pure diagonal ≠ checkWinner
    expect(
      findPaths(state, 'player1').every(
        (p) => p.nodes.length < CONFIG.WIN_LENGTH
      )
    ).toBe(true);
    expect(checkWinner(state)).toBeNull();
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
