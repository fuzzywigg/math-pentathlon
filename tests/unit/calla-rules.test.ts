import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  getOppositePitIndex,
  isSideEmpty,
  CallaGameState,
} from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  makeMove,
  isGameOver,
  getPhaseMessage,
} from '../../src/games/calla/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Calla – selection helpers', () => {
  it('all pits 0-4 are valid initially for player1', () => {
    const state = createInitialState();

    expect(getValidPits(state)).toEqual([0, 1, 2, 3, 4]);
    for (let i = 0; i < 5; i++) {
      expect(canSelectPit(state, 'player1', i)).toBe(true);
    }
  });

  it('illegal empty pit is a no-op (same reference)', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 3, 3, 3, 3],
    };
    const before = state;

    expect(canSelectPit(state, 'player1', 0)).toBe(false);
    expect(makeMove(state, 0)).toBe(before);
  });

  it('getOppositePitIndex(0) === 4', () => {
    expect(getOppositePitIndex(0)).toBe(4);
  });
});

describe('Calla – makeMove distribution and free turns', () => {
  it('makeMove from pit 0 distributes three cubes into pits 1-3', () => {
    const state = createInitialState();
    const next = makeMove(state, 0);

    expect(next.player1Pits[0]).toBe(0);
    expect(next.player1Pits[1]).toBe(4); // 3 + 1
    expect(next.player1Pits[2]).toBe(4);
    expect(next.player1Pits[3]).toBe(4);
    expect(next.player1Pits[4]).toBe(3); // unchanged
    expect(next.player1Calla).toBe(0);
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0]).toMatchObject({
      pitIndex: 0,
      cubesDistributed: 3,
      gotFreeTurn: false,
    });
  });

  it('pit 2 with 3 cubes lands in calla for a free turn', () => {
    const state = createInitialState();
    expect(state.player1Pits[2]).toBe(3);

    const next = makeMove(state, 2);

    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.currentPlayer).toBe('player1');
    expect(next.player1Calla).toBe(1);
    expect(next.player1Pits[2]).toBe(0);
    expect(next.player1Pits[3]).toBe(4);
    expect(next.player1Pits[4]).toBe(4);
  });
});

describe('Calla – game over', () => {
  it('crafted empty own side triggers gameOver after move', () => {
    // P1 has a single cube in pit 0; other P1 pits empty.
    // After sowing into pit 1 (still empty side ends? Wait - after move
    // pit 0 is empty and cube goes to pit 1, so side is not empty.
    // Need a state where AFTER the move one side is fully empty.
    // Give P1 one cube in pit 4 so it lands in calla; all other P1 pits 0.
    // After move: P1 pits still all 0 → game over.
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [2, 2, 2, 2, 2],
      player1Calla: 5,
      player2Calla: 5,
    };

    expect(isSideEmpty(state, 'player1')).toBe(false);

    const next = makeMove(state, 4);

    expect(isGameOver(next)).toBe(true);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).not.toBeNull();
    expect(next.player1Pits.every((c) => c === 0)).toBe(true);
    expect(getPhaseMessage(next)).toMatch(/wins|tie/i);
  });

  it('getPhaseMessage describes selectPit for active game', () => {
    const state = createInitialState();
    expect(getPhaseMessage(state)).toContain("Blue's turn");
  });
});
