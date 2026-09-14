/**
 * Wave 48 — Pinball startGame + nextChallenge settle. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, nextChallenge, submitAnswer } from '../../src/games/fraction-pinball/rules';

afterEach(() => vi.restoreAllMocks());

function mockSeqRandom() {
  let i = 0;
  const seq = [0.12, 0.23, 0.34, 0.45, 0.56, 0.67, 0.78, 0.89, 0.15, 0.26, 0.37, 0.48, 0.59, 0.61, 0.72, 0.83];
  vi.spyOn(Math, 'random').mockImplementation(() => seq[i++ % seq.length]);
}

describe('Wave 48 pinball — start/next settle', () => {
  it('startGame loads challenge; maxRounds settle draw', () => {
    mockSeqRandom();
    const started = startGame(createInitialState());
    expect(started.phase).toBe('answering');
    expect(started.currentChallenge).not.toBeNull();
    const answered = submitAnswer(started, started.currentChallenge!.correctAnswer);
    expect(answered.phase).toBe('showResult');
    expect(answered.isCorrect).toBe(true);
    const over = nextChallenge({
      ...answered,
      roundNumber: answered.maxRounds,
      player1Stats: { ...answered.player1Stats, score: 10 },
      player2Stats: { ...answered.player2Stats, score: 10 },
    });
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBeNull();
  });
});
