/**
 * Wave 44 — Fab-a-Diffy executeMove happy path with real matching answers.
 * Distinct from wave41: ordered subtract/divide that executeMove accepts.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

describe('Wave 44 Fab — execute happy path real matches', () => {
  function synth(
    a: { n: number; d: number },
    b: { n: number; d: number },
    answer: { n: number; d: number }
  ): FabADiffyState {
    const state = createInitialState();
    const fractionBars = new Map(state.fractionBars);
    const answerBars = new Map(state.answerBars);
    fractionBars.clear();
    answerBars.clear();
    fractionBars.set('b1', {
      id: 'b1',
      fraction: { numerator: a.n, denominator: a.d },
      owner: null,
      used: false,
    });
    fractionBars.set('b2', {
      id: 'b2',
      fraction: { numerator: b.n, denominator: b.d },
      owner: null,
      used: false,
    });
    answerBars.set('ans', {
      id: 'ans',
      fraction: { numerator: answer.n, denominator: answer.d },
      claimedBy: null,
    });
    return { ...state, fractionBars, answerBars };
  }

  it('subtract ordered pair 3/4 − 1/4 claims 1/2', () => {
    let state = synth({ n: 3, d: 4 }, { n: 1, d: 4 }, { n: 1, d: 2 });
    const result = calculateResult(
      state.fractionBars.get('b1')!.fraction,
      state.fractionBars.get('b2')!.fraction,
      'subtract'
    )!;
    expect(areEquivalent(result, { numerator: 1, denominator: 2 })).toBe(true);
    expect(findMatchingAnswers(state, result)).toEqual(['ans']);
    state = selectBar1(state, 'b1');
    state = selectBar2(state, 'b2');
    state = selectOperation(state, 'subtract');
    const next = executeMove(state, 'ans');
    expect(next.scores.player1).toBe(1);
    expect(next.answerBars.get('ans')?.claimedBy).toBe('player1');
    expect(next.moveHistory[0]).toMatchObject({
      operation: 'subtract',
      bar1Id: 'b1',
      bar2Id: 'b2',
      resultId: 'ans',
      moveNumber: 1,
    });
  });

  it('divide ordered pair 1/2 ÷ 1/4 claims 2/1', () => {
    let state = synth({ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 2, d: 1 });
    // Extra unclaimed answer + unused bars so game continues after claim
    state.answerBars.set('open', {
      id: 'open',
      fraction: { numerator: 1, denominator: 5 },
      claimedBy: null,
    });
    state.fractionBars.set('pad1', {
      id: 'pad1',
      fraction: { numerator: 1, denominator: 12 },
      owner: null,
      used: false,
    });
    state.fractionBars.set('pad2', {
      id: 'pad2',
      fraction: { numerator: 5, denominator: 12 },
      owner: null,
      used: false,
    });
    state = selectBar1(state, 'b1');
    state = selectBar2(state, 'b2');
    state = selectOperation(state, 'divide');
    const next = executeMove(state, 'ans');
    expect(next.phase).toBe('selectingBar1');
    expect(next.scores.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.answerBars.get('ans')?.claimedBy).toBe('player1');
  });

  it('multiply 1/2 × 1/3 claims 1/6', () => {
    let state = synth({ n: 1, d: 2 }, { n: 1, d: 3 }, { n: 1, d: 6 });
    state = selectBar1(state, 'b1');
    state = selectBar2(state, 'b2');
    state = selectOperation(state, 'multiply');
    const next = executeMove(state, 'ans');
    expect(next.answerBars.get('ans')?.claimedBy).toBe('player1');
    expect(next.fractionBars.get('b1')?.used).toBe(true);
  });
});
