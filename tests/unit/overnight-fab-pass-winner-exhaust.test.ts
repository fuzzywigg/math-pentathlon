/**
 * Overnight TOKENMAXX — Fab passTurn / checkWinner exhaust leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  passTurn,
  checkWinner,
  hasAnyValidMove,
  getOperationSymbol,
  formatMove,
} from '../../src/games/fab-a-diffy/rules';
import type { AnswerBar, FractionBar, FabMove } from '../../src/games/fab-a-diffy/types';

describe('Overnight fab — pass / winner / format', () => {
  it('pass flips seat; stuck settle picks score leader', () => {
    let state = createInitialState();
    const answers = new Map(state.answerBars);
    for (const [id, a] of answers) {
      answers.set(id, { ...a, claimedBy: 'player1' });
    }
    state = { ...state, answerBars: answers, scores: { player1: 3, player2: 1 } };
    expect(hasAnyValidMove(state)).toBe(false);
    state = passTurn(state);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
  });

  it('checkWinner all-claimed equal claims prefers player2 branch', () => {
    const answers = new Map<string, AnswerBar>([
      ['a1', { id: 'a1', fraction: { numerator: 1, denominator: 2 }, claimedBy: 'player1' }],
      ['a2', { id: 'a2', fraction: { numerator: 1, denominator: 3 }, claimedBy: 'player2' }],
    ]);
    // p1Claims > p2Claims ? p1 : p2 → equal → player2
    expect(checkWinner(answers, new Map())).toBe('player2');
  });

  it('near-exhaust used bars with tied claims returns null', () => {
    const answers = new Map<string, AnswerBar>([
      ['a1', { id: 'a1', fraction: { numerator: 1, denominator: 2 }, claimedBy: 'player1' }],
      ['a2', { id: 'a2', fraction: { numerator: 1, denominator: 3 }, claimedBy: 'player2' }],
      ['a3', { id: 'a3', fraction: { numerator: 1, denominator: 4 }, claimedBy: null }],
    ]);
    const bars = new Map<string, FractionBar>([
      ['b1', { id: 'b1', fraction: { numerator: 1, denominator: 2 }, owner: null, used: true }],
      ['b2', { id: 'b2', fraction: { numerator: 1, denominator: 3 }, owner: null, used: true }],
    ]);
    expect(checkWinner(answers, bars)).toBeNull();
  });

  it('operation symbols and formatMove miss', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
    const state = createInitialState();
    const move: FabMove = {
      player: 'player1',
      bar1Id: 'missing',
      bar2Id: 'missing2',
      operation: 'add',
      resultId: 'missing3',
      moveNumber: 1,
    };
    expect(formatMove(state, move)).toBe('?');
  });
});
