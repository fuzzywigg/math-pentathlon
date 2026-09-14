/**
 * Overnight HEAVY — handshake across prime × fiar × frac × pent leftovers.
 * Opening seats + null AI gates only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIPlacement, isAITurn as primeIsAI } from '../../src/games/prime-gold/ai';
import { getAIMove as fiarAI } from '../../src/games/fiar/ai';
import { getAIAnswer, isAITurn as fracIsAI } from '../../src/games/frac-fact/ai';
import { getAIMove as pentAI, isAITurn as pentIsAI } from '../../src/games/pent-em-in/ai';
import { createInitialState as primeInit } from '../../src/games/prime-gold/rules';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';

describe('Overnight handshake — prime/fiar/frac/pent', () => {
  it('openings seat player1', () => {
    expect(primeInit().currentPlayer).toBe('player1');
    expect(fiarInit().currentPlayer).toBe('player1');
    expect(fracInit('easy').currentPlayer).toBe('player1');
    expect(pentInit().currentPlayer).toBe('player1');
  });

  it('wrong-seat / null gates across four engines', () => {
    const prime = {
      ...primeInit(),
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    expect(getAIPlacement(prime, 'player2', 'hard')).toBeNull();
    expect(primeIsAI(primeInit(), null, 'human-vs-ai')).toBe(false);

    const fiar = fiarInit();
    expect(fiarAI({ ...fiar, phase: 'gameOver', winner: 'player1' }, 'player1')).toBeNull();

    const frac = {
      ...fracInit('easy'),
      phase: 'playing' as const,
      currentProblem: {
        id: 'hs',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 2 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 1 },
        answerChoices: [{ numerator: 1, denominator: 1 }],
      },
    };
    expect(getAIAnswer(frac, 'player2', 'hard')).toBeNull();
    expect(fracIsAI(frac, null)).toBe(false);

    const pent = pentInit();
    expect(pentAI(pent, 'player2', 'medium')).toBeNull();
    expect(pentIsAI(pent, null)).toBe(false);
  });
});
