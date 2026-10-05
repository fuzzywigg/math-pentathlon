/**
 * Play-budget iterative deepening for Queens (#377) and Hex (#382).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as createQueensState } from '../../src/games/queens-guards/types';
import {
  searchAIMove,
  AI_PLAY_DEADLINE_MS as QUEENS_PLAY_MS,
} from '../../src/games/queens-guards/ai';
import { getValidMoves as getQueensMoves } from '../../src/games/queens-guards/rules';
import { createInitialState as createHexState } from '../../src/games/hex/types';
import {
  searchBestMove,
  AI_PLAY_DEADLINE_MS as HEX_PLAY_MS,
} from '../../src/games/hex/ai';
import {
  getValidMoves as getHexMoves,
  makeMove as makeHexMove,
} from '../../src/games/hex/rules';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Queens play-budget search', () => {
  it('exposes a Hard play budget far below the 180s safety cap', () => {
    expect(QUEENS_PLAY_MS.hard).toBeLessThanOrEqual(3000);
    expect(QUEENS_PLAY_MS.hard).toBeGreaterThan(0);
  });

  it('deadline 0 still truncates on a full opening', () => {
    const state = createQueensState();
    let ticks = 0;
    const result = searchAIMove(state, 'player1', 'easy', {
      seed: 1,
      deadlineMs: 0,
      now: () => (ticks++ === 0 ? 0 : 1),
    });
    expect(result.truncated).toBe(true);
  });

  it('tight budget returns a legal move (anytime ID)', () => {
    const state = createQueensState();
    const result = searchAIMove(state, 'player1', 'hard', {
      seed: 3,
      deadlineMs: 25,
    });
    expect(result.move).not.toBeNull();
    const legal = getQueensMoves(state, result.move!.from);
    expect(
      legal.some(
        (t) =>
          t.ring === result.move!.to.ring &&
          t.position === result.move!.to.position
      )
    ).toBe(true);
  });

  it('Hard opening stays near the play budget', () => {
    const state = createQueensState();
    const budget = QUEENS_PLAY_MS.hard;
    const t0 = performance.now();
    const result = searchAIMove(state, 'player1', 'hard', {
      seed: 1,
      deadlineMs: budget,
    });
    const elapsed = performance.now() - t0;
    expect(result.move).not.toBeNull();
    expect(elapsed).toBeLessThan(budget + 750);
  }, 10_000);
});

describe('Hex play-budget search', () => {
  it('exposes a Hard play budget of a few seconds', () => {
    expect(HEX_PLAY_MS.hard).toBeLessThanOrEqual(3000);
    expect(HEX_PLAY_MS.hard).toBeGreaterThan(0);
  });

  it('tight budget midgame returns a legal empty cell', () => {
    let state = createHexState(11);
    state = makeHexMove(state, { row: 5, col: 5 });
    state = makeHexMove(state, { row: 5, col: 6 });
    state = makeHexMove(state, { row: 4, col: 5 });
    state = makeHexMove(state, { row: 6, col: 5 });
    const result = searchBestMove(state, 'player1', 'hard', {
      seed: 9,
      deadlineMs: 25,
    });
    expect(result.move).not.toBeNull();
    expect(
      getHexMoves(state).some(
        (m) => m.row === result.move!.row && m.col === result.move!.col
      )
    ).toBe(true);
  });

  it('Hard midgame stays near the play budget', () => {
    let state = createHexState(11);
    state = makeHexMove(state, { row: 5, col: 5 });
    state = makeHexMove(state, { row: 5, col: 6 });
    state = makeHexMove(state, { row: 4, col: 5 });
    state = makeHexMove(state, { row: 6, col: 5 });
    const budget = HEX_PLAY_MS.hard;
    const t0 = performance.now();
    const result = searchBestMove(state, 'player1', 'hard', {
      seed: 4,
      deadlineMs: budget,
    });
    const elapsed = performance.now() - t0;
    expect(result.move).not.toBeNull();
    expect(elapsed).toBeLessThan(budget + 750);
  }, 10_000);

  it('unlimited Hard midgame still completes maxDepth without truncation', () => {
    let state = createHexState(11);
    state = makeHexMove(state, { row: 5, col: 5 });
    state = makeHexMove(state, { row: 5, col: 6 });
    state = makeHexMove(state, { row: 4, col: 5 });
    state = makeHexMove(state, { row: 6, col: 5 });
    const result = searchBestMove(state, 'player1', 'hard', { seed: 4 });
    expect(result.move).not.toBeNull();
    expect(result.truncated).toBe(false);
    expect(
      getHexMoves(state).some(
        (m) => m.row === result.move!.row && m.col === result.move!.col
      )
    ).toBe(true);
  }, 15_000);
});
