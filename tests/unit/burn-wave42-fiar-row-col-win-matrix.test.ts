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
  placements: Array<{
    id: string;
    chip: 'player1' | 'player2';
    kind?: 'plain' | 'marked';
  }>
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const p of placements) {
    nodes.set(p.id, {
      ...nodes.get(p.id)!,
      chip: p.chip,
      chipKind: p.kind ?? 'plain',
    });
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
      { id: 'c1r2', chip: 'player1' },
      { id: 'c2r2', chip: 'player1' },
      { id: 'c3r2', chip: 'player1' },
      { id: 'c4r2', chip: 'player1' },
    ]);
    expect(checkWinner(state)).toBe('player1');
    const paths = findPaths(state, 'player1');
    expect(paths.some((p) => !p.isBlocked && p.nodes.length >= 4)).toBe(true);
  });

  it('vertical four unblocked wins for player2', () => {
    const state = movementBoard([
      { id: 'c2r1', chip: 'player2' },
      { id: 'c2r2', chip: 'player2' },
      { id: 'c2r3', chip: 'player2' },
      { id: 'c2r4', chip: 'player2' },
    ]);
    expect(checkWinner(state)).toBe('player2');
  });

  it('row with adjacent opponent blocked', () => {
    const path = ['c1r2', 'c2r2', 'c3r2', 'c4r2'];
    const state = movementBoard([
      { id: 'c1r2', chip: 'player1' },
      { id: 'c2r2', chip: 'player1' },
      { id: 'c3r2', chip: 'player1' },
      { id: 'c4r2', chip: 'player1' },
      { id: 'c2r1', chip: 'player2', kind: 'marked' },
    ]);
    expect(isPathBlocked(state, path, 'player1')).toBe(true);
    expect(checkWinner(state)).toBeNull();
  });

  it('column win via moveChip transitions gameOver', () => {
    const state = movementBoard([
      { id: 'c2r1', chip: 'player1' },
      { id: 'c2r2', chip: 'player1' },
      { id: 'c2r3', chip: 'player1' },
      { id: 'c2r5', chip: 'player1' },
      { id: 'c6r1', chip: 'player2' },
      { id: 'c6r2', chip: 'player2' },
      { id: 'c6r3', chip: 'player2' },
      { id: 'c6r4', chip: 'player2' },
    ]);
    const next = moveChip(state, 'c2r5', 'c2r4');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
