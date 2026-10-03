import { describe, it, expect } from 'vitest';
import {
  FiarGameState,
  createInitialState,
  Player,
} from '../../src/games/fiar/types';
import {
  placeChip,
  findPaths,
  isPathBlocked,
  checkWinner,
  forceChip,
} from '../../src/games/fiar/rules';
import { getConnectedNodes } from '../../src/games/fiar/types';
import { getPlayerColor, getPlayerName } from '../../src/games/fiar/board-ui';

function placeMany(state: FiarGameState, nodeIds: string[]): FiarGameState {
  let s = state;
  for (const id of nodeIds) {
    s = placeChip(s, id);
  }
  return s;
}

describe('FIAR – findPaths / isPathBlocked', () => {
  it('findPaths is empty on a fresh board', () => {
    const state = createInitialState();
    expect(findPaths(state, 'player1')).toEqual([]);
    expect(findPaths(state, 'player2')).toEqual([]);
  });

  it('findPaths detects a length-4 alignment once crafted', () => {
    let state = createInitialState();
    const candidates = ['c1r2', 'c2r2', 'c3r2', 'c4r2'];
    const allExist = candidates.every((id) => state.board.nodes.has(id));
    expect(allExist).toBe(true);
    for (const id of candidates) {
      state = forceChip(state, id, 'player1');
    }
    const paths = findPaths(state, 'player1');
    expect(paths.length).toBeGreaterThan(0);
    expect(paths.some((p) => p.nodes.length >= 4)).toBe(true);
  });

  it('isPathBlocked is false when no opponent marked neighbors touch the path', () => {
    let state = createInitialState();
    const path = ['c1r2', 'c2r2', 'c3r2', 'c4r2'];
    for (const id of path) {
      state = forceChip(state, id, 'player1');
    }
    expect(isPathBlocked(state, path, 'player1')).toBe(false);
  });

  it('isPathBlocked false for plain opponent adjacent; true for marked', () => {
    let state = createInitialState();
    const path = ['c1r2', 'c2r2', 'c3r2', 'c4r2'];
    for (const id of path) {
      state = forceChip(state, id, 'player1');
    }
    const neighbor = getConnectedNodes(state.board, path[0]!).find(
      (id) => !path.includes(id)
    );
    expect(neighbor).toBeTruthy();
    state = forceChip(state, neighbor!, 'player2', 'plain');
    expect(isPathBlocked(state, path, 'player1')).toBe(false);

    state = forceChip(state, neighbor!, 'player2', 'marked');
    expect(isPathBlocked(state, path, 'player1')).toBe(true);
  });

  it('placement win still surfaces paths', () => {
    const state = placeMany(createInitialState(), [
      'c0r3',
      'c5r3',
      'c1r3',
      'c6r3',
      'c2r3',
      'c7r3',
      'c3r3',
    ]);
    expect(checkWinner(state)).toBe('player1');
    expect(findPaths(state, 'player1').length).toBeGreaterThan(0);
  });
});

describe('FIAR – board-ui helpers', () => {
  it('getPlayerName / getPlayerColor return stable labels', () => {
    expect(getPlayerName('player1').length).toBeGreaterThan(0);
    expect(getPlayerName('player2').length).toBeGreaterThan(0);
    expect(getPlayerColor('player1')).toMatch(/^#|^rgb|var\(/i);
    expect(getPlayerColor('player2')).toMatch(/^#|^rgb|var\(/i);
  });
});

void (null as unknown as Player);
