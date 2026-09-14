/**
 * Overnight HEAVY — FIAR findPaths/checkWinner are cardinal-only (slice 0..4).
 * Distinct leftover documenting diagonal-four does NOT win (vs row/col). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { findPaths, checkWinner } from '../../src/games/fiar/rules';
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
  it('getDirections exposes diagonals but win scan half is cardinal-only', () => {
    const dirs = getDirections();
    expect(dirs).toHaveLength(8);
    const half = dirs.slice(0, 4);
    expect(half.every((d) => d.dx === 0 || d.dy === 0)).toBe(true);
    expect(dirs.slice(4).every((d) => d.dx !== 0 && d.dy !== 0)).toBe(true);
  });

  it('pure diagonal four does not produce a winner under current rules', () => {
    const state = movementBoard([
      { id: '0-0', chip: 'player1' },
      { id: '1-1', chip: 'player1' },
      { id: '2-2', chip: 'player1' },
      { id: '3-3', chip: 'player1' },
    ]);
    expect(checkWinner(state)).toBeNull();
    const paths = findPaths(state, 'player1');
    expect(paths.every((p) => p.nodes.length < 4 || p.isBlocked)).toBe(true);
  });

  it('horizontal four still wins (cardinal path intact)', () => {
    const state = movementBoard([
      { id: '2-0', chip: 'player1' },
      { id: '2-1', chip: 'player1' },
      { id: '2-2', chip: 'player1' },
      { id: '2-3', chip: 'player1' },
    ]);
    expect(checkWinner(state)).toBe('player1');
  });
});
