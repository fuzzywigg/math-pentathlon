/**
 * Overnight HEAVY — FIAR win scan covers cardinal + diagonal half-dirs.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findPaths, checkWinner, getStraightLines } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  getDirections,
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

describe('Overnight fiar — diagonal vs cardinal win scan', () => {
  it('getDirections exposes diagonals; win scan uses one ray per axis', () => {
    const dirs = getDirections();
    expect(dirs).toHaveLength(8);
    const half = [dirs[0]!, dirs[2]!, dirs[4]!, dirs[6]!];
    expect(half).toHaveLength(4);
    expect(half.some((d) => d.dx !== 0 && d.dy !== 0)).toBe(true);
    expect(getStraightLines(createInitialState())).toHaveLength(24);
  });

  it('pure diagonal four wins under official pathway rules', () => {
    // Spec line: c1r2, c2r3, c3r4, c4r5
    const state = movementBoard([
      { id: 'c1r2', chip: 'player1' },
      { id: 'c2r3', chip: 'player1' },
      { id: 'c3r4', chip: 'player1' },
      { id: 'c4r5', chip: 'player1' },
    ]);
    expect(checkWinner(state)).toBe('player1');
    const paths = findPaths(state, 'player1');
    expect(paths.some((p) => !p.isBlocked && p.nodes.length >= 4)).toBe(true);
  });

  it('horizontal four still wins (cardinal path intact)', () => {
    const state = movementBoard([
      { id: 'c0r3', chip: 'player1' },
      { id: 'c1r3', chip: 'player1' },
      { id: 'c2r3', chip: 'player1' },
      { id: 'c3r3', chip: 'player1' },
    ]);
    expect(checkWinner(state)).toBe('player1');
  });
});
