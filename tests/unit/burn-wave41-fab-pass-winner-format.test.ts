/**
 * Wave 41 — Fab-a-Diffy passTurn / checkWinner / format leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  passTurn,
  checkWinner,
  getOperationSymbol,
  formatMove,
  hasAnyValidMove,
} from '../../src/games/fab-a-diffy/rules';
import type {
  AnswerBar,
  FabADiffyState,
  FractionBar,
} from '../../src/games/fab-a-diffy/types';

describe('Wave 41 fab-a-diffy — pass winner format', () => {
  it('getOperationSymbol matrix', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('formatMove ? for unknown ids; passTurn flips seat', () => {
    const state = createInitialState();
    expect(
      formatMove(state, {
        player: 'player1',
        bar1Id: 'missing',
        bar2Id: 'missing',
        operation: 'add',
        resultId: 'missing',
        moveNumber: 1,
      })
    ).toBe('?');

    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBar1).toBeNull();
    expect(next.phase).toBe('selectingBar1');
  });

  it('checkWinner claims all answers / near-exhausted bars', () => {
    const state = createInitialState();
    const answers = new Map<string, AnswerBar>();
    let i = 0;
    for (const [, a] of state.answerBars) {
      answers.set(`a${i}`, {
        ...a,
        id: `a${i}`,
        claimedBy: i % 2 === 0 ? 'player1' : 'player2',
      });
      i++;
    }
    const winner = checkWinner(answers, state.fractionBars);
    expect(winner === 'player1' || winner === 'player2').toBe(true);

    const bars = new Map<string, FractionBar>();
    const all = [...state.fractionBars.values()];
    all.forEach((b, idx) => {
      bars.set(b.id, { ...b, used: idx < all.length - 1 });
    });
    // Almost all used with unequal claims
    const sparseAnswers = new Map<string, AnswerBar>([
      ['x', { id: 'x', fraction: { numerator: 1, denominator: 2 }, claimedBy: 'player1' }],
      ['y', { id: 'y', fraction: { numerator: 1, denominator: 3 }, claimedBy: null }],
    ]);
    expect(checkWinner(sparseAnswers, bars)).toBe('player1');
  });

  it('passTurn ends game when opponent also has no valid move', () => {
    const state = createInitialState();
    // Mark all bars used → hasAnyValidMove false
    const bars = new Map(state.fractionBars);
    for (const [id, b] of bars) {
      bars.set(id, { ...b, used: true });
    }
    const stuck: FabADiffyState = { ...state, fractionBars: bars };
    expect(hasAnyValidMove(stuck)).toBe(false);
    const next = passTurn(stuck);
    expect(next.phase).toBe('gameOver');
  });
});
