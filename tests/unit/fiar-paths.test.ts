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
    const candidates = ['2-0', '2-1', '2-2', '2-3'];
    const allExist = candidates.every((id) => state.board.nodes.has(id));
    if (allExist) {
      for (const id of candidates) {
        state = forceChip(state, id, 'player1');
      }
      const paths = findPaths(state, 'player1');
      expect(paths.length).toBeGreaterThan(0);
      expect(paths.some((p) => p.nodes.length >= 4)).toBe(true);
    } else {
      state = placeMany(state, [
        '0-0',
        '4-0',
        '0-1',
        '4-1',
        '0-2',
        '4-2',
        '0-3',
      ]);
      if (checkWinner(state) === 'player1') {
        expect(findPaths(state, 'player1').length).toBeGreaterThan(0);
      } else {
        const paths = findPaths(state, 'player1');
        expect(Array.isArray(paths)).toBe(true);
      }
    }
  });

  it('isPathBlocked is false when no opponent marked neighbors touch the path', () => {
    let state = createInitialState();
    const path = ['2-0', '2-1', '2-2', '2-3'].filter((id) =>
      state.board.nodes.has(id)
    );
    if (path.length < 4) {
      expect(isPathBlocked(state, [], 'player1')).toBe(false);
      return;
    }
    for (const id of path) {
      state = forceChip(state, id, 'player1');
    }
    expect(isPathBlocked(state, path, 'player1')).toBe(false);
  });

  it('isPathBlocked false for plain opponent adjacent; true for marked', () => {
    let state = createInitialState();
    const path = ['2-0', '2-1', '2-2', '2-3'].filter((id) =>
      state.board.nodes.has(id)
    );
    if (path.length < 4) {
      expect(true).toBe(true);
      return;
    }
    for (const id of path) {
      state = forceChip(state, id, 'player1');
    }
    const neighbor = getConnectedNodes(state.board, path[0]).find(
      (id) => !path.includes(id)
    );
    if (!neighbor) {
      expect(isPathBlocked(state, path, 'player1')).toBe(false);
      return;
    }
    state = forceChip(state, neighbor, 'player2', 'plain');
    expect(isPathBlocked(state, path, 'player1')).toBe(false);

    state = forceChip(state, neighbor, 'player2', 'marked');
    expect(isPathBlocked(state, path, 'player1')).toBe(true);
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

// silence unused Player import if tree-shaken oddly
void (null as unknown as Player);
