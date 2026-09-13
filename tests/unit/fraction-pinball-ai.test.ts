import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  ConversionChallenge,
} from '../../src/games/fraction-pinball/types';
import { getAIAnswer, isAITurn } from '../../src/games/fraction-pinball/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

const challenge: ConversionChallenge = {
  id: 'pinball-ai',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 2 },
  decimal: 0.5,
  answerChoices: ['0.5', '0.25', '0.75', '0.2'],
  correctAnswer: '0.5',
};

function answeringState(
  overrides: Partial<ReturnType<typeof createInitialState>> = {}
) {
  return {
    ...createInitialState(),
    phase: 'answering' as const,
    currentChallenge: challenge,
    ...overrides,
  };
}

describe('Fraction Pinball AI', () => {
  it('isAITurn only during answering for the AI seat', () => {
    const state = answeringState();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
    expect(isAITurn({ ...state, phase: 'showResult' }, 'player1')).toBe(false);
  });

  it('getAIAnswer returns null without challenge / wrong phase / wrong seat', () => {
    expect(
      getAIAnswer(
        { ...answeringState(), currentChallenge: null },
        'player1',
        'hard'
      )
    ).toBeNull();
    expect(
      getAIAnswer(
        { ...answeringState(), phase: 'gameOver' },
        'player1',
        'hard'
      )
    ).toBeNull();
    expect(getAIAnswer(answeringState(), 'player2', 'hard')).toBeNull();
  });

  it('getAIAnswer hard returns the correct answer when accuracy hits', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const answer = getAIAnswer(answeringState(), 'player1', 'hard');
    expect(answer).toBe('0.5');
  });

  it('getAIAnswer easy returns one of the listed choices', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const answer = getAIAnswer(answeringState(), 'player1', 'easy');
    expect(answer).not.toBeNull();
    expect(challenge.answerChoices).toContain(answer);
  });

  it('getAIAnswer medium returns a listed choice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const answer = getAIAnswer(answeringState(), 'player1', 'medium');
    expect(challenge.answerChoices).toContain(answer);
  });

  it('isAITurn true for player2 when answering', () => {
    const state = answeringState({ currentPlayer: 'player2' });
    expect(isAITurn(state, 'player2')).toBe(true);
  });
});
