/**
 * Overnight HEAVY — handshake across pinball × remainder × kings × queens AI.
 * Opening seats + null gates only (no heavy minimax / full-board search).
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAIAnswer,
  isAITurn as pinballIsAI,
} from '../../src/games/fraction-pinball/ai';
import {
  getAIIslandChoice,
  isAITurn as remIsAI,
} from '../../src/games/remainder-islands/ai';
import { isAITurn as kingsIsAI } from '../../src/games/kings-quadraphages/ai';
import { getAIMove as queensAI } from '../../src/games/queens-guards/ai';
import { createInitialState as pinballInit } from '../../src/games/fraction-pinball/types';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as queensInit } from '../../src/games/queens-guards/types';
import { findValidIslands } from '../../src/games/remainder-islands/rules';

describe('Overnight handshake — pinball/remainder/kings/queens', () => {
  it('openings seat player1 with empty history', () => {
    const p = pinballInit();
    const r = remInit();
    const k = createInitialGameState();
    const q = queensInit();
    expect([
      p.currentPlayer,
      r.currentPlayer,
      k.currentPlayer,
      q.currentPlayer,
    ]).toEqual(['player1', 'player1', 'player1', 'player1']);
    expect(k.moveHistory).toHaveLength(0);
    expect(r.moveHistory).toHaveLength(0);
    expect(q.moveHistory).toHaveLength(0);
    expect(p.currentChallenge).toBeNull();
  });

  it('wrong-seat / null-ai gates across engines', () => {
    const pin = {
      ...pinballInit(),
      phase: 'answering' as const,
      currentPlayer: 'player1' as const,
      currentChallenge: {
        id: 'hs',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25'],
        correctAnswer: '0.5',
      },
    };
    expect(getAIAnswer(pin, 'player2', 'hard')).toBeNull();
    expect(pinballIsAI(pin, null)).toBe(false);
    expect(pinballIsAI(pin, 'player1')).toBe(true);

    const remBase = remInit();
    const roll = { die1: 4, die2: 4, total: 8 };
    const rem = {
      ...remBase,
      phase: 'selectIsland' as const,
      currentRoll: roll,
      validIslands: findValidIslands(remBase, roll.total),
    };
    expect(getAIIslandChoice(rem, 'player2', 'easy')).toBeNull();
    expect(remIsAI(rem, null)).toBe(false);
    expect(remIsAI(rem, 'player1')).toBe(true);

    const kings = createInitialGameState();
    expect(kingsIsAI(kings, null, 'human-vs-ai')).toBe(false);
    expect(kingsIsAI(kings, 'player2', 'human-vs-ai')).toBe(false);
    expect(kingsIsAI(kings, 'player1', 'human-vs-ai')).toBe(true);

    const queens = queensInit();
    expect(queensAI(queens, 'player2', 'medium')).toBeNull();
  });
});
