/**
 * Wave 42 — FIAR column/row win + path block matrix (leftover angles). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  findPaths,
  checkWinner,
  isPathBlocked,
  moveChip,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
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

describe('Wave 42 fiar — row/col win matrix', () => {
  it('horizontal four unblocked wins', () => {
    const state = movementBoard([
      { id: '1-0', chip: 'player1' },
      { id: '1-1', chip: 'player1' },
      { id: '1-2', chip: 'player1' },
      { id: '1-3', chip: 'player1' },
    ]);
    expect(checkWinner(state)).toBe('player1');
    const paths = findPaths(state, 'player1');
    expect(paths.some((p) => !p.isBlocked && p.nodes.length >= 4)).toBe(true);
  });

  it('vertical four unblocked wins for player2', () => {
    const state = movementBoard([
      { id: '0-2', chip: 'player2' },
      { id: '1-2', chip: 'player2' },
      { id: '2-2', chip: 'player2' },
      { id: '3-2', chip: 'player2' },
    ]);
    expect(checkWinner(state)).toBe('player2');
  });

  it('row with adjacent opponent blocked', () => {
    const path = ['2-0', '2-1', '2-2', '2-3'];
    const state = movementBoard([
      { id: '2-0', chip: 'player1' },
      { id: '2-1', chip: 'player1' },
      { id: '2-2', chip: 'player1' },
      { id: '2-3', chip: 'player1' },
      { id: '1-1', chip: 'player2' },
    ]);
    expect(isPathBlocked(state, path, 'player1')).toBe(true);
    expect(checkWinner(state)).toBeNull();
  });

  it('column win via moveChip transitions gameOver', () => {
    const state = movementBoard([
      { id: '0-0', chip: 'player1' },
      { id: '1-0', chip: 'player1' },
      { id: '2-0', chip: 'player1' },
      { id: '4-0', chip: 'player1' },
      { id: '0-4', chip: 'player2' },
      { id: '1-4', chip: 'player2' },
      { id: '2-4', chip: 'player2' },
      { id: '3-4', chip: 'player2' },
    ]);
    const next = moveChip(state, '4-0', '3-0');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
