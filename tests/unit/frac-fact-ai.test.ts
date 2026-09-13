import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  FractionProblem,
} from '../../src/games/frac-fact/types';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

const problem: FractionProblem = {
  id: 'ai-problem',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 1, denominator: 2 },
    { numerator: 1, denominator: 4 },
    { numerator: 2, denominator: 3 },
  ],
};

function playingState(
  overrides: Partial<ReturnType<typeof createInitialState>> = {}
) {
  return {
    ...createInitialState('easy'),
    phase: 'playing' as const,
    currentProblem: problem,
    ...overrides,
  };
}

describe('Frac Fact AI', () => {
  it('isAITurn only during playing for the AI seat', () => {
    const state = playingState();
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
    expect(isAITurn(state, 'player2')).toBe(false);
    expect(isAITurn({ ...state, phase: 'showingResult' }, 'player1')).toBe(
      false
    );
  });

  it('getAIAnswer returns null without a problem / wrong phase / wrong seat', () => {
    expect(
      getAIAnswer(
        { ...playingState(), currentProblem: null },
        'player1',
        'hard'
      )
    ).toBeNull();
    expect(
      getAIAnswer({ ...playingState(), phase: 'gameOver' }, 'player1', 'hard')
    ).toBeNull();
    expect(getAIAnswer(playingState(), 'player2', 'hard')).toBeNull();
  });

  it('getAIAnswer hard returns the correct choice when accuracy hits', () => {
    // accuracy 0.95 — force the accuracy branch, skip teaching (hard has none)
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const answer = getAIAnswer(playingState(), 'player1', 'hard');
    expect(answer).not.toBeNull();
    expect(answer!.numerator).toBe(3);
    expect(answer!.denominator).toBe(4);
  });

  it('getAIAnswer easy returns one of the listed choices', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const answer = getAIAnswer(playingState(), 'player1', 'easy');
    expect(answer).not.toBeNull();
    expect(
      problem.answerChoices.some(
        (c) =>
          c.numerator === answer!.numerator &&
          c.denominator === answer!.denominator
      )
    ).toBe(true);
  });

  it('getAIAnswer medium returns a choice from the problem', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const answer = getAIAnswer(playingState(), 'player1', 'medium');
    expect(answer).not.toBeNull();
    expect(
      problem.answerChoices.some(
        (c) =>
          c.numerator === answer!.numerator &&
          c.denominator === answer!.denominator
      )
    ).toBe(true);
  });

  it('isAITurn true for player2 when it is their turn', () => {
    const state = playingState({ currentPlayer: 'player2' });
    expect(isAITurn(state, 'player2')).toBe(true);
  });
});
