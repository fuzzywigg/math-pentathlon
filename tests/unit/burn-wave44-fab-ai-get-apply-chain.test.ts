/**
 * Wave 44 — Fab-a-Diffy getAIMove hard/medium determinism leftovers.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove, applyAIMoveSteps } from '../../src/games/fab-a-diffy/ai';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Fab AI — getAIMove apply chain', () => {
  function tinyBoard(): FabADiffyState {
    const state = createInitialState();
    const fractionBars = new Map(state.fractionBars);
    const answerBars = new Map(state.answerBars);
    fractionBars.clear();
    answerBars.clear();
    fractionBars.set('x', {
      id: 'x',
      fraction: { numerator: 1, denominator: 2 },
      owner: null,
      used: false,
    });
    fractionBars.set('y', {
      id: 'y',
      fraction: { numerator: 1, denominator: 3 },
      owner: null,
      used: false,
    });
    // 1/2 + 1/3 = 5/6
    answerBars.set('fiveSix', {
      id: 'fiveSix',
      fraction: { numerator: 5, denominator: 6 },
      claimedBy: null,
    });
    return { ...state, fractionBars, answerBars };
  }

  it('hard getAIMove on tiny board returns usable ids', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const board = tinyBoard();
    const move = getAIMove(board, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(['x', 'y']).toContain(move!.bar1Id);
    expect(['x', 'y']).toContain(move!.bar2Id);
    expect(move!.bar1Id).not.toBe(move!.bar2Id);
    expect(move!.answerId).toBe('fiveSix');
  });

  it('applyAIMoveSteps after getAIMove claims fiveSix', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const board = tinyBoard();
    const move = getAIMove(board, 'player1', 'medium');
    expect(move).not.toBeNull();
    const next = applyAIMoveSteps(board, move!);
    expect(next.answerBars.get('fiveSix')?.claimedBy).toBe('player1');
    expect(next.scores.player1).toBe(1);
  });

  it('player2 seat on tiny board after flip can move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let board = tinyBoard();
    // add another pair + answer so player2 has a move after p1
    board.fractionBars.set('p', {
      id: 'p',
      fraction: { numerator: 1, denominator: 4 },
      owner: null,
      used: false,
    });
    board.fractionBars.set('q', {
      id: 'q',
      fraction: { numerator: 1, denominator: 4 },
      owner: null,
      used: false,
    });
    board.answerBars.set('half', {
      id: 'half',
      fraction: { numerator: 1, denominator: 2 },
      claimedBy: null,
    });
    const m1 = getAIMove(board, 'player1', 'hard');
    board = applyAIMoveSteps(board, m1!);
    expect(board.currentPlayer).toBe('player2');
    const m2 = getAIMove(board, 'player2', 'hard');
    expect(m2).not.toBeNull();
  });
});
