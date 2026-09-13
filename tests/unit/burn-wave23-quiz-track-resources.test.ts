/**
 * Wave 23 — quiz / track / island resource ledgers after legal success.
 * Distinct from wave 16 place-score, wave 18 math-preview, wave 19
 * opening-invariants / status-ui, wave 22 expression UI. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createFrac,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from '../../src/games/frac-fact/types';
import {
  startGame as startFrac,
  submitAnswer as submitFrac,
  nextProblem,
} from '../../src/games/frac-fact/rules';

import {
  createInitialState as createPin,
  INITIAL_BALLS,
} from '../../src/games/fraction-pinball/types';
import {
  startGame as startPin,
  submitAnswer as submitPin,
} from '../../src/games/fraction-pinball/rules';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
} from '../../src/games/star-track/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
  findValidIslands,
  countOwnedIslands,
} from '../../src/games/remainder-islands/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

/** Constant Math.random hangs Frac/Pinball distractor while-loops — cycle instead. */
function cycleRandom() {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n = (n + 1) % 997;
    return (n + 1) / 997;
  });
}

describe('Wave 23 quiz-track — Frac Fact streak/score/wrong ledgers', () => {
  it('correct answer bumps score + streak; wrong bumps wrongAnswers and clears streak', () => {
    cycleRandom();
    let state = startFrac(createFrac());
    expect(state.currentProblem).not.toBeNull();
    const problem = state.currentProblem!;
    const correct = problem.correctAnswer;

    const afterCorrect = submitFrac(state, correct);
    expect(afterCorrect.isCorrect).toBe(true);
    expect(afterCorrect.player1Stats.correctAnswers).toBe(1);
    expect(afterCorrect.player1Stats.currentStreak).toBe(1);
    expect(afterCorrect.player1Stats.score).toBe(
      POINTS_PER_CORRECT + 0 * STREAK_BONUS
    );
    expect(afterCorrect.player2Stats.score).toBe(0);

    const forced = {
      ...startFrac(createFrac()),
      currentProblem: {
        id: 'forced',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'add' as const,
        correctAnswer: { numerator: 1, denominator: 2 },
        answerChoices: [
          { numerator: 1, denominator: 2 },
          { numerator: 1, denominator: 3 },
        ],
      },
      phase: 'playing' as const,
      player1Stats: {
        score: 20,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 3,
        bestStreak: 3,
      },
    };
    const afterWrong = submitFrac(forced, { numerator: 1, denominator: 3 });
    expect(afterWrong.isCorrect).toBe(false);
    expect(afterWrong.player1Stats.wrongAnswers).toBe(1);
    expect(afterWrong.player1Stats.currentStreak).toBe(0);
    expect(afterWrong.player1Stats.score).toBe(20);
    expect(afterWrong.player1Stats.correctAnswers).toBe(0);
    expect(afterWrong.player1Stats.bestStreak).toBe(3);
  });

  it('nextProblem advances problemsCompleted inventory', () => {
    cycleRandom();
    let state = startFrac(createFrac());
    state = submitFrac(state, state.currentProblem!.correctAnswer);
    expect(state.phase).toBe('showingResult');
    const before = state.problemsCompleted;
    state = nextProblem(state);
    expect(state.problemsCompleted).toBe(before + 1);
    expect(state.phase).toBe('playing');
    expect(state.currentPlayer).toBe('player2');
  });

  it('second consecutive correct applies STREAK_BONUS once streak≥1', () => {
    // Force two playing states with known answers for player1 streaks
    const base = {
      ...createFrac(),
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: {
        id: 'a',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 4 },
        operation: 'add' as const,
        correctAnswer: { numerator: 3, denominator: 4 },
        answerChoices: [
          { numerator: 3, denominator: 4 },
          { numerator: 1, denominator: 2 },
        ],
      },
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      player2Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
    };
    const first = submitFrac(base, { numerator: 3, denominator: 4 });
    expect(first.player1Stats.score).toBe(POINTS_PER_CORRECT);
    expect(first.player1Stats.currentStreak).toBe(1);

    const secondState = {
      ...first,
      phase: 'playing' as const,
      currentPlayer: 'player1' as const,
      currentProblem: {
        id: 'b',
        operand1: { numerator: 1, denominator: 3 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'add' as const,
        correctAnswer: { numerator: 2, denominator: 3 },
        answerChoices: [
          { numerator: 2, denominator: 3 },
          { numerator: 1, denominator: 3 },
        ],
      },
      isCorrect: null,
    };
    const second = submitFrac(secondState, { numerator: 2, denominator: 3 });
    // score += POINTS + previousStreak * STREAK_BONUS (streak was 1 before bump)
    expect(second.player1Stats.score).toBe(
      POINTS_PER_CORRECT + (POINTS_PER_CORRECT + 1 * STREAK_BONUS)
    );
    expect(second.player1Stats.currentStreak).toBe(2);
    expect(second.player1Stats.bestStreak).toBe(2);
    expect(second.player1Stats.correctAnswers).toBe(2);
  });
});

describe('Wave 23 quiz-track — Pinball ballsRemaining ledger', () => {
  it('wrong answer spends one ball; correct leaves balls unchanged', () => {
    cycleRandom();
    let state = startPin(createPin());
    expect(state.player1Stats.ballsRemaining).toBe(INITIAL_BALLS);
    expect(state.currentChallenge).not.toBeNull();
    expect(state.phase).toBe('answering');

    const challenge = state.currentChallenge!;
    const wrongChoice = challenge.answerChoices.find(
      (a) => a !== challenge.correctAnswer
    )!;
    const afterWrong = submitPin(state, wrongChoice);
    expect(afterWrong.isCorrect).toBe(false);
    expect(afterWrong.player1Stats.ballsRemaining).toBe(INITIAL_BALLS - 1);
    expect(afterWrong.player1Stats.wrongAnswers).toBe(1);
    expect(afterWrong.player1Stats.score).toBe(0);

    state = startPin(createPin());
    const correct = state.currentChallenge!.correctAnswer;
    const ballsBefore = state.player1Stats.ballsRemaining;
    const afterOk = submitPin(state, correct);
    expect(afterOk.isCorrect).toBe(true);
    expect(afterOk.player1Stats.ballsRemaining).toBe(ballsBefore);
    expect(afterOk.player1Stats.correctAnswers).toBe(1);
    expect(afterOk.player1Stats.score).toBeGreaterThan(0);
  });

  it('second miss on forced answering state drains another ball', () => {
    const answering = {
      ...createPin(),
      phase: 'answering' as const,
      currentPlayer: 'player1' as const,
      currentChallenge: {
        id: 'c',
        type: 'fractionToDecimal' as const,
        fraction: { numerator: 1, denominator: 2 },
        decimal: 0.5,
        answerChoices: ['0.5', '0.25', '0.75', '1'],
        correctAnswer: '0.5',
      },
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 1,
        ballsRemaining: INITIAL_BALLS - 1,
      },
      player2Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        ballsRemaining: INITIAL_BALLS,
      },
    };
    const after = submitPin(answering, '0.25');
    expect(after.isCorrect).toBe(false);
    expect(after.player1Stats.ballsRemaining).toBe(INITIAL_BALLS - 2);
    expect(after.player1Stats.wrongAnswers).toBe(2);
    expect(after.player2Stats.ballsRemaining).toBe(INITIAL_BALLS);
  });
});

describe('Wave 23 quiz-track — Star Track bucket + progress', () => {
  it('drawChains removes 2; selectChain returns unused (+1 net −1) and advances progress', () => {
    let state = createStar();
    const bucketBefore = state.chainBucket.length;
    expect(bucketBefore).toBeGreaterThanOrEqual(2);
    expect(getProgress(state, 'player1')).toBe(0);

    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    expect(state.drawnChains).not.toBeNull();
    expect(state.chainBucket.length).toBe(bucketBefore - 2);

    const selectedLen = state.drawnChains![0].length;
    state = selectChain(state, 0);
    expect(state.chainBucket.length).toBe(bucketBefore - 1);
    expect(state.player1Position).toBe(Math.min(selectedLen, TRACK_LENGTH));
    expect(getProgress(state, 'player1')).toBe(
      (state.player1Position / TRACK_LENGTH) * 100
    );
    expect(getProgress(state, 'player2')).toBe(0);
  });

  it('player2 draw→select advances only player2 progress ledger', () => {
    let state = createStar();
    state = drawChains(state);
    state = selectChain(state, 0);
    const p1Pos = state.player1Position;
    const bucketAfterP1 = state.chainBucket.length;

    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('drawChains');
    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    expect(state.drawnChains).not.toBeNull();
    const len = state.drawnChains![0].length;
    state = selectChain(state, 0);
    expect(state.player1Position).toBe(p1Pos);
    expect(state.player2Position).toBe(Math.min(len, TRACK_LENGTH));
    expect(getProgress(state, 'player2')).toBeGreaterThan(0);
    expect(state.chainBucket.length).toBe(bucketAfterP1 - 1);
  });
});

describe('Wave 23 quiz-track — Remainder island ownership + chip spend', () => {
  it('selectIsland claims island, spends a player chip, bumps owned count', () => {
    let claimed = false;
    for (let seed = 0; seed < 40 && !claimed; seed++) {
      vi.spyOn(Math, 'random').mockReturnValue(seed / 40);
      let state = createRemainder();
      const chipsBefore = state.player1Chips;
      const oppChips = state.player2Chips;
      state = performRoll(state);
      if (state.phase !== 'selectIsland' || !state.currentRoll) {
        vi.restoreAllMocks();
        continue;
      }
      const valid =
        state.validIslands.length > 0
          ? state.validIslands
          : findValidIslands(state, state.currentRoll.total);
      if (valid.length === 0) {
        vi.restoreAllMocks();
        continue;
      }
      const islandId = valid[0];
      const ownedBefore = countOwnedIslands(state);
      const islandBefore = state.islands.find((i) => i.id === islandId)!;
      const chipsOnIsland = islandBefore.chips;
      state = selectIsland(state, islandId);
      expect(state.islands.find((i) => i.id === islandId)?.owner).toBe(
        'player1'
      );
      expect(state.islands.find((i) => i.id === islandId)?.chips).toBe(
        chipsOnIsland + 1
      );
      expect(state.player1Chips).toBe(chipsBefore - 1);
      expect(state.player2Chips).toBe(oppChips);
      const ownedAfter = countOwnedIslands(state);
      expect(ownedAfter.player1).toBe(ownedBefore.player1 + 1);
      claimed = true;
      vi.restoreAllMocks();
    }
    expect(claimed).toBe(true);
  });
});
