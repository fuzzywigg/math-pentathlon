/**
 * Wave 42 — Fab-a-Diffy formatMove known vs missing ids. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  formatMove,
  getOperationSymbol,
} from '../../src/games/fab-a-diffy/rules';
import { formatFraction } from '../../src/core/fractions/arithmetic';

describe('Wave 42 fab — formatMove ids', () => {
  it('missing ids return ?', () => {
    const state = createInitialState();
    expect(
      formatMove(state, {
        player: 'player1',
        bar1Id: 'nope-1',
        bar2Id: 'nope-2',
        operation: 'add',
        resultId: 'nope-a',
        moveNumber: 1,
      })
    ).toBe('?');
  });

  it('known ids render equation with op symbol', () => {
    const state = createInitialState();
    const bar1Id = [...state.fractionBars.keys()][0];
    const bar2Id = [...state.fractionBars.keys()][1];
    const answerId = [...state.answerBars.keys()][0];
    const bar1 = state.fractionBars.get(bar1Id)!;
    const bar2 = state.fractionBars.get(bar2Id)!;
    const answer = state.answerBars.get(answerId)!;
    const text = formatMove(state, {
      player: 'player1',
      bar1Id,
      bar2Id,
      operation: 'multiply',
      resultId: answerId,
      moveNumber: 1,
    });
    expect(text).toBe(
      `${formatFraction(bar1.fraction)} ${getOperationSymbol('multiply')} ${formatFraction(bar2.fraction)} = ${formatFraction(answer.fraction)}`
    );
  });
});
