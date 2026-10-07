import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, submitAnswer } from '../../src/games/fraction-pinball/rules';
import { renderScores } from '../../src/games/fraction-pinball/board-ui';

describe('Fraction Pinball — ballsRemaining floor', () => {
  it('clamps balls at 0 on repeated misses (no String.repeat crash)', () => {
    let s = startGame(createInitialState());
    s = {
      ...s,
      player1Stats: {
        ...s.player1Stats,
        ballsRemaining: 0,
      },
    };
    const wrong = s.currentChallenge!.answerChoices.find(
      (c) => c !== s.currentChallenge!.correctAnswer
    )!;
    s = submitAnswer(s, wrong);
    expect(s.player1Stats.ballsRemaining).toBe(0);
    expect(() => renderScores(s)).not.toThrow();
    expect(
      renderScores(s).querySelector('.pinball-player-score.player1 .pinball-balls')
        ?.textContent
    ).toBe('');
  });

  it('renderScores tolerates negative ballsRemaining defensively', () => {
    const s = {
      ...createInitialState(),
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 6,
        ballsRemaining: -2,
      },
    };
    expect(() => renderScores(s)).not.toThrow();
  });
});
