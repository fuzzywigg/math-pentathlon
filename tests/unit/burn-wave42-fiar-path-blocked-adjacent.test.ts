/**
 * Wave 42 — FIAR isPathBlocked true when opponent adjacent off-path. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isPathBlocked, findPaths, checkWinner } from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
  type FiarGameState,
} from '../../src/games/fiar/types';

function boardWith(
  placements: Array<{ id: string; chip: 'player1' | 'player2' }>
): FiarGameState {
  const state = createInitialState();
  const nodes = new Map(state.board.nodes);
  for (const { id, chip } of placements) {
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

describe('Wave 42 fiar — path blocked adjacent', () => {
  it('isPathBlocked true when opponent sits adjacent off the path', () => {
    const state = boardWith([
      { id: '2-0', chip: 'player1' },
      { id: '2-1', chip: 'player1' },
      { id: '2-2', chip: 'player1' },
      { id: '2-3', chip: 'player1' },
      { id: '1-2', chip: 'player2' }, // adjacent above mid-path
    ]);
    const path = ['2-0', '2-1', '2-2', '2-3'];
    expect(isPathBlocked(state, path, 'player1')).toBe(true);
  });

  it('findPaths marks the four-row as blocked when opponent touches it', () => {
    const state = boardWith([
      { id: '4-0', chip: 'player2' },
      { id: '4-1', chip: 'player2' },
      { id: '4-2', chip: 'player2' },
      { id: '4-3', chip: 'player2' },
      { id: '3-1', chip: 'player1' },
    ]);
    const paths = findPaths(state, 'player2');
    const long = paths.filter((p) => p.nodes.length >= CONFIG.WIN_LENGTH);
    expect(long.length).toBeGreaterThan(0);
    expect(long.every((p) => p.isBlocked)).toBe(true);
    expect(checkWinner(state)).toBeNull();
  });

  it('isPathBlocked false when only same-player chips touch the path', () => {
    const state = boardWith([
      { id: '0-0', chip: 'player1' },
      { id: '0-1', chip: 'player1' },
      { id: '0-2', chip: 'player1' },
      { id: '0-3', chip: 'player1' },
      { id: '1-1', chip: 'player1' }, // own chip adjacent — not an opponent block
    ]);
    expect(isPathBlocked(state, ['0-0', '0-1', '0-2', '0-3'], 'player1')).toBe(
      false
    );
  });
});
