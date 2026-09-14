/**
 * Wave 42 leftovers B — Handshake fab apply steps × frac stats × remainder AI.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState as fabInit } from '../../src/games/fab-a-diffy/rules';
import { executeAITurn, applyAIMoveSteps } from '../../src/games/fab-a-diffy/ai';
import {
  createInitialState as fracInit,
  getPlayerStats,
} from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';
import {
  createInitialState as remInit,
  type RemainderIslandsState,
} from '../../src/games/remainder-islands/types';
import { executeAISelection } from '../../src/games/remainder-islands/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 handshake — fab × frac × remainder', () => {
  it('fab executeAITurn claims; frac submit bumps p1 only; rem AI selects', () => {
    const fabNext = executeAITurn(fabInit(), 'player1', 'hard');
    expect([...fabNext.answerBars.values()].some((a) => a.claimedBy)).toBe(
      true
    );

    let frac = startGame(fracInit('easy'));
    const ans = frac.currentProblem!.correctAnswer;
    frac = submitAnswer(frac, ans);
    expect(getPlayerStats(frac, 'player1').correctAnswers).toBe(1);
    expect(getPlayerStats(frac, 'player2').correctAnswers).toBe(0);

    const rem = remInit();
    const ready: RemainderIslandsState = {
      ...rem,
      phase: 'selectIsland',
      currentRoll: { die1: 3, die2: 4, total: 7 },
      validIslands: rem.islands.slice(0, 3).map((i) => i.id),
    };
    const remNext = executeAISelection(ready, 'player1', 'medium');
    expect(remNext.currentPlayer).toBe('player2');
  });

  it('fab applyAIMoveSteps bad op still passes seat', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const state = fabInit();
    const next = applyAIMoveSteps(state, {
      bar1Id: 'x',
      bar2Id: 'y',
      operation: 'add',
      answerId: 'z',
    });
    expect(next.currentPlayer).toBe('player2');
  });
});
