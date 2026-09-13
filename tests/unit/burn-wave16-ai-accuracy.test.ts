/**
 * Wave 16 — AI difficulty / accuracy / teaching-mode + quiz generator contracts.
 * Distinct from win-draw terminals and rules-phase illegal matrices.
 * Tests-only. Avoid constant Math.random around generateProblem/generateChallenge
 * (distractor fill loops can spin forever when RNG is glued).
 * No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createFrac,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
  DEFAULT_MAX_PROBLEMS,
  getPlayerStats as fracStats,
} from '../../src/games/frac-fact/types';
import {
  startGame as startFrac,
  generateProblem,
  checkAnswer,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';
import { getAIAnswer as fracAnswer, isAITurn as fracIsAI } from '../../src/games/frac-fact/ai';

import {
  createInitialState as createPinball,
  INITIAL_BALLS,
  MAX_ROUNDS,
  TARGET_POINTS,
  getPlayerStats as pinStats,
} from '../../src/games/fraction-pinball/types';
import {
  startGame as startPin,
  generateChallenge,
  formatDecimal,
  formatFraction as formatPinFrac,
  hitRandomTarget,
  checkAnswer as pinCheck,
} from '../../src/games/fraction-pinball/rules';
import { getAIAnswer as pinAnswer, isAITurn as pinIsAI } from '../../src/games/fraction-pinball/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getAIMove as callaMove, analyzeMoves } from '../../src/games/calla/ai';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  FRACTION_BAR_VALUES,
  ANSWER_BAR_VALUES,
} from '../../src/games/fab-a-diffy/types';
import { getAIMove as fabMove } from '../../src/games/fab-a-diffy/ai';

import {
  createInitialState as createJuggle,
  doRollDice,
} from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import { getAISelection } from '../../src/games/hex-a-gone/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { getAIChainChoice } from '../../src/games/star-track/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentMove } from '../../src/games/pent-em-in/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parMove } from '../../src/games/par-55/ai';

/** Deterministic but non-constant RNG so distractor fill loops can terminate. */
function mockSteppedRandom(start = 0.13, step = 0.07) {
  let x = start;
  return vi.spyOn(Math, 'random').mockImplementation(() => {
    x = (x + step) % 1;
    return x;
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 16 AI accuracy — Frac Fact', () => {
  it('startGame then hard accuracy seed returns a choice from answerChoices', () => {
    const state = startFrac(createFrac('hard')); // real RNG for generator
    expect(state.currentProblem).not.toBeNull();
    expect(fracIsAI(state, 'player1')).toBe(true);
    vi.spyOn(Math, 'random').mockReturnValue(0.01); // high accuracy path
    const answer = fracAnswer(state, 'player1', 'hard');
    expect(answer).not.toBeNull();
    expect(
      state.currentProblem!.answerChoices.some(
        (c) =>
          c.numerator === answer!.numerator &&
          c.denominator === answer!.denominator
      )
    ).toBe(true);
  });

  it('easy teaching mode returns a choice under miss seed', () => {
    const state = startFrac(createFrac('easy'));
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // < 0.35 teaching miss
    const answer = fracAnswer(state, 'player1', 'easy');
    expect(answer).not.toBeNull();
    expect(state.currentProblem!.answerChoices).toContainEqual(answer);
  });

  it('generateProblem / checkAnswer / formatFraction / op symbols', () => {
    mockSteppedRandom();
    const problem = generateProblem('medium', 3);
    expect(problem.id).toBe('problem-3');
    expect(problem.answerChoices.length).toBeGreaterThanOrEqual(2);
    expect(checkAnswer(problem, problem.correctAnswer)).toBe(true);
    expect(
      checkAnswer(problem, {
        numerator: problem.correctAnswer.numerator + 7,
        denominator: problem.correctAnswer.denominator,
      })
    ).toBe(false);
    expect(formatFraction({ numerator: 3, denominator: 4 })).toBe('3/4');
    expect(formatFraction({ numerator: 5, denominator: 1 })).toBe('5');
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('scoring constants and getPlayerStats wiring', () => {
    const state = createFrac();
    expect(POINTS_PER_CORRECT).toBe(10);
    expect(STREAK_BONUS).toBe(5);
    expect(DEFAULT_MAX_PROBLEMS).toBe(10);
    expect(fracStats(state, 'player1').score).toBe(0);
    expect(fracStats(state, 'player2')).toEqual(state.player2Stats);
  });
});

describe('Wave 16 AI accuracy — Fraction Pinball', () => {
  it('startGame + hard returns correctAnswer under high accuracy seed', () => {
    const state = startPin(createPinball());
    expect(state.phase).toBe('answering');
    expect(pinIsAI(state, 'player1')).toBe(true);
    vi.spyOn(Math, 'random').mockReturnValue(0.01);
    const answer = pinAnswer(state, 'player1', 'hard');
    expect(answer).toBe(state.currentChallenge!.correctAnswer);
  });

  it('easy teaching miss seed returns a listed choice', () => {
    const state = startPin(createPinball());
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const answer = pinAnswer(state, 'player1', 'easy');
    expect(answer).not.toBeNull();
    expect(state.currentChallenge!.answerChoices).toContain(answer);
  });

  it('generateChallenge / formatters / hitRandomTarget / constants', () => {
    mockSteppedRandom(0.21, 0.11);
    const even = generateChallenge(2);
    expect(even.type).toBe('fractionToDecimal');
    expect(even.answerChoices).toContain(even.correctAnswer);
    const odd = generateChallenge(3);
    expect(odd.type).toBe('decimalToFraction');
    expect(formatDecimal(0.5)).toBe('0.5');
    expect(formatDecimal(2)).toBe('2');
    expect(formatPinFrac({ numerator: 1, denominator: 2 })).toBe('1/2');
    expect(pinCheck(even, even.correctAnswer)).toBe(true);

    const targets = createPinball().targets;
    expect(targets).toHaveLength(TARGET_POINTS.length);
    const hit = hitRandomTarget(targets);
    expect(TARGET_POINTS).toContain(hit.points);
    expect(hit.target.value).toBe(hit.points);

    expect(INITIAL_BALLS).toBe(5);
    expect(MAX_ROUNDS).toBe(10);
    expect(pinStats(createPinball(), 'player1').ballsRemaining).toBe(
      INITIAL_BALLS
    );
  });
});

describe('Wave 16 AI accuracy — Calla / Fab / Juggle / HAG', () => {
  it('Calla easy and hard both pick from valid analyzed pits', () => {
    mockSteppedRandom(0.3, 0.17);
    const state = createCalla();
    const analyses = analyzeMoves(state, 'player1');
    const pits = analyses.map((a) => a.pit);
    const easy = callaMove(state, 'player1', 'easy');
    const hard = callaMove(state, 'player1', 'hard');
    expect(easy).not.toBeNull();
    expect(hard).not.toBeNull();
    expect(pits).toContain(easy!.pit);
    expect(pits).toContain(hard!.pit);
  });

  it('Fab easy returns a move with bar ids from the pool', () => {
    mockSteppedRandom(0.2, 0.09);
    const state = createFab();
    // easy only — findAllValidMoves is heavy; medium/hard already covered in fab-a-diffy-ai
    const move = fabMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(state.fractionBars.has(move!.bar1Id)).toBe(true);
    expect(state.fractionBars.has(move!.bar2Id)).toBe(true);
    expect(state.answerBars.has(move!.answerId)).toBe(true);
    expect(FRACTION_BAR_VALUES.length).toBeGreaterThan(0);
    expect(ANSWER_BAR_VALUES.length).toBeGreaterThan(0);
  }, 15000);

  it('Juggle die choice and HAG selection nonempty under easy+hard', () => {
    mockSteppedRandom(0.55, 0.13);
    const juggle = doRollDice(createJuggle());
    expect(getAIDieChoice(juggle, 'player1', 'easy')).not.toBeNull();
    expect(getAIDieChoice(juggle, 'player1', 'hard')).not.toBeNull();

    const hag = createHag();
    expect(
      getAISelection(hag, 'player1', 'easy')!.blocks.length
    ).toBeGreaterThan(0);
    expect(
      getAISelection(hag, 'player1', 'hard')!.blocks.length
    ).toBeGreaterThan(0);
  });
});

describe('Wave 16 AI accuracy — Star / Pent / Par choosers', () => {
  it('Star easy/hard chain choice after draw is 0|1', () => {
    mockSteppedRandom(0.4, 0.15);
    const drawn = drawChains(createStar());
    for (const diff of ['easy', 'hard'] as const) {
      const choice = getAIChainChoice(drawn, 'player1', diff);
      expect(choice).not.toBeNull();
      expect([0, 1]).toContain(choice!.chainIndex);
    }
  });

  it('Pent / Par easy moves are legal-shaped when available', () => {
    mockSteppedRandom(0.28, 0.19);
    const pent = pentMove(createPent(), 'player1', 'easy');
    if (pent) {
      expect(pent.shapeId).toBeTruthy();
      expect(pent.position).toBeTruthy();
    }
    const par = parMove(createPar(), 'player1', 'easy');
    if (par) {
      expect(par.blockId).toBeTruthy();
      expect(par.baseId).toBeTruthy();
    }
  });
});
