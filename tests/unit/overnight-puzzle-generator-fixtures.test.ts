/**
 * Overnight TOKENMAXX HEAVY — puzzle-generator fixtures.
 * Deepens Frac Fact generateProblem + Fraction Pinball generateChallenge
 * around difficulty tiers already present, duplicate-id prevention,
 * empty problem bank, and seed determinism (via stepped Math.random).
 * Existing modules only. Tests-only. No product inventing.
 * Avoids wave38/40/41 leftover-engine themes.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { COMMON_FRACTIONS, type Fraction } from '../../src/core/fractions/types';
import {
  createInitialState as createFrac,
  type Difficulty,
  type FractionProblem,
  type FracFactState,
} from '../../src/games/frac-fact/types';
import {
  generateProblem,
  checkAnswer,
  startGame as startFrac,
  nextProblem,
  submitAnswer as submitFrac,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';

import {
  createInitialState as createPin,
  type ConversionChallenge,
  type FractionPinballState,
} from '../../src/games/fraction-pinball/types';
import {
  generateChallenge,
  checkAnswer as pinCheck,
  startGame as startPin,
  nextChallenge,
  submitAnswer as submitPin,
  formatDecimal,
  formatFraction as formatPinFrac,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

/** Deterministic non-constant RNG so distractor fill loops can terminate. */
function mockSteppedRandom(start = 0.17, step = 0.09) {
  let x = start;
  return vi.spyOn(Math, 'random').mockImplementation(() => {
    x = (x + step) % 1;
    if (x === 0) x = step;
    return x;
  });
}

function fracKey(f: Fraction): string {
  return `${f.numerator}/${f.denominator}`;
}

function uniqueFracKeys(choices: Fraction[]): string[] {
  return [...new Set(choices.map(fracKey))];
}

function snapshotProblem(p: FractionProblem) {
  return {
    id: p.id,
    operand1: { ...p.operand1 },
    operand2: { ...p.operand2 },
    operation: p.operation,
    correctAnswer: { ...p.correctAnswer },
    answerChoices: p.answerChoices.map((c) => ({ ...c })),
  };
}

function snapshotChallenge(c: ConversionChallenge) {
  return {
    id: c.id,
    type: c.type,
    fraction: { ...c.fraction },
    decimal: c.decimal,
    correctAnswer: c.correctAnswer,
    answerChoices: [...c.answerChoices],
  };
}

// =============================================================================
// Shared FIXED fixtures (empty-bank / inject paths — no generator RNG)
// =============================================================================

const FIXTURE_EASY_ADD: FractionProblem = {
  id: 'fixture-easy-1',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 4 },
    { numerator: 1, denominator: 4 },
  ],
};

const FIXTURE_MEDIUM_MUL: FractionProblem = {
  id: 'fixture-medium-1',
  operand1: { numerator: 1, denominator: 3 },
  operand2: { numerator: 3, denominator: 4 },
  operation: 'multiply',
  correctAnswer: { numerator: 1, denominator: 4 },
  answerChoices: [
    { numerator: 1, denominator: 4 },
    { numerator: 4, denominator: 12 },
    { numerator: 1, denominator: 3 },
    { numerator: 3, denominator: 7 },
  ],
};

const FIXTURE_HARD_DIV: FractionProblem = {
  id: 'fixture-hard-1',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'divide',
  correctAnswer: { numerator: 2, denominator: 1 },
  answerChoices: [
    { numerator: 2, denominator: 1 },
    { numerator: 1, denominator: 8 },
    { numerator: 1, denominator: 2 },
    { numerator: 3, denominator: 4 },
  ],
};

const FIXTURE_PIN_F2D: ConversionChallenge = {
  id: 'fixture-pin-f2d',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 2 },
  decimal: 0.5,
  answerChoices: ['0.5', '0.25', '0.75', '1'],
  correctAnswer: '0.5',
};

const FIXTURE_PIN_D2F: ConversionChallenge = {
  id: 'fixture-pin-d2f',
  type: 'decimalToFraction',
  fraction: { numerator: 1, denominator: 4 },
  decimal: 0.25,
  answerChoices: ['1/4', '1/2', '1/3', '2/5'],
  correctAnswer: '1/4',
};

function playingFrac(
  problem: FractionProblem,
  overrides: Partial<FracFactState> = {}
): FracFactState {
  return {
    ...createFrac('easy'),
    currentProblem: problem,
    phase: 'playing',
    ...overrides,
  };
}

function answeringPin(
  challenge: ConversionChallenge,
  overrides: Partial<FractionPinballState> = {}
): FractionPinballState {
  return {
    ...createPin(),
    currentChallenge: challenge,
    phase: 'answering',
    ...overrides,
  };
}

// =============================================================================
// Empty problem bank
// =============================================================================

describe('Overnight puzzle-generator — empty bank', () => {
  it('Frac Fact createInitialState starts with null problem and empty history', () => {
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const state = createFrac(diff);
      expect(state.currentProblem).toBeNull();
      expect(state.problemHistory).toEqual([]);
      expect(state.problemsCompleted).toBe(0);
      expect(state.difficulty).toBe(diff);
      expect(state.selectedAnswer).toBeNull();
      expect(state.isCorrect).toBeNull();
      expect(state.winner).toBeNull();
    }
  });

  it('Frac Fact startGame fills empty bank with problem-1', () => {
    mockSteppedRandom(0.11, 0.08);
    const started = startFrac(createFrac('medium'));
    expect(started.currentProblem).not.toBeNull();
    expect(started.currentProblem!.id).toBe('problem-1');
    expect(started.phase).toBe('playing');
    expect(started.problemHistory).toEqual([]);
  });

  it('Pinball createInitialState starts with null challenge (empty bank)', () => {
    const state = createPin();
    expect(state.currentChallenge).toBeNull();
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
    expect(state.roundNumber).toBe(1);
    expect(state.winner).toBeNull();
  });

  it('Pinball startGame fills empty bank with challenge-1', () => {
    mockSteppedRandom(0.22, 0.1);
    const started = startPin(createPin());
    expect(started.currentChallenge).not.toBeNull();
    expect(started.currentChallenge!.id).toBe('challenge-1');
    expect(started.phase).toBe('answering');
  });

  it('submitAnswer on empty-bank Frac Fact is identity no-op', () => {
    const empty = createFrac('easy');
    expect(submitFrac(empty, { numerator: 1, denominator: 2 })).toBe(empty);
  });

  it('submitAnswer on empty-bank Pinball is identity no-op', () => {
    const empty = createPin();
    expect(submitPin(empty, '0.5')).toBe(empty);
  });

  it('FIXED fixtures cover each Frac difficulty tier without generator RNG', () => {
    expect(checkAnswer(FIXTURE_EASY_ADD, FIXTURE_EASY_ADD.correctAnswer)).toBe(
      true
    );
    expect(
      checkAnswer(FIXTURE_MEDIUM_MUL, FIXTURE_MEDIUM_MUL.correctAnswer)
    ).toBe(true);
    expect(checkAnswer(FIXTURE_HARD_DIV, FIXTURE_HARD_DIV.correctAnswer)).toBe(
      true
    );
    expect(checkAnswer(FIXTURE_EASY_ADD, { numerator: 1, denominator: 2 })).toBe(
      false
    );

    const easyPlay = submitFrac(playingFrac(FIXTURE_EASY_ADD), {
      numerator: 3,
      denominator: 4,
    });
    expect(easyPlay.isCorrect).toBe(true);
    expect(easyPlay.problemHistory).toHaveLength(1);
    expect(easyPlay.problemHistory[0]!.problem.id).toBe('fixture-easy-1');

    const medMiss = submitFrac(playingFrac(FIXTURE_MEDIUM_MUL), {
      numerator: 1,
      denominator: 3,
    });
    expect(medMiss.isCorrect).toBe(false);

    const hardOk = submitFrac(playingFrac(FIXTURE_HARD_DIV), {
      numerator: 2,
      denominator: 1,
    });
    expect(hardOk.isCorrect).toBe(true);
  });

  it('FIXED Pinball fixtures check without touching convertible bank RNG', () => {
    expect(pinCheck(FIXTURE_PIN_F2D, '0.5')).toBe(true);
    expect(pinCheck(FIXTURE_PIN_F2D, '0.25')).toBe(false);
    expect(pinCheck(FIXTURE_PIN_D2F, '1/4')).toBe(true);
    expect(pinCheck(FIXTURE_PIN_D2F, '1/2')).toBe(false);

    const hit = submitPin(answeringPin(FIXTURE_PIN_F2D), '0.5');
    expect(hit.isCorrect).toBe(true);
    expect(hit.phase).toBe('showResult');

    const miss = submitPin(answeringPin(FIXTURE_PIN_D2F), '1/2');
    expect(miss.isCorrect).toBe(false);
    expect(miss.player1Stats.ballsRemaining).toBe(
      createPin().player1Stats.ballsRemaining - 1
    );
  });
});

// =============================================================================
// Difficulty tiers (already present in Frac Fact)
// =============================================================================

describe('Overnight puzzle-generator — difficulty tiers', () => {
  const SAMPLE = 48;

  function sampleProblems(diff: Difficulty, seed = 0.13, step = 0.07) {
    mockSteppedRandom(seed, step);
    const out: FractionProblem[] = [];
    for (let i = 1; i <= SAMPLE; i++) {
      out.push(generateProblem(diff, i));
    }
    return out;
  }

  it('easy tier: only add/subtract; operand denominators ≤ 4', () => {
    const problems = sampleProblems('easy', 0.19, 0.11);
    for (const p of problems) {
      expect(['add', 'subtract']).toContain(p.operation);
      expect(p.operand1.denominator).toBeLessThanOrEqual(4);
      expect(p.operand2.denominator).toBeLessThanOrEqual(4);
      expect(p.answerChoices.length).toBe(4);
      expect(
        p.answerChoices.some(
          (c) =>
            c.numerator === p.correctAnswer.numerator &&
            c.denominator === p.correctAnswer.denominator
        )
      ).toBe(true);
      expect(p.correctAnswer.numerator).toBeGreaterThanOrEqual(0);
    }
    expect(problems.some((p) => p.operation === 'add')).toBe(true);
    expect(problems.some((p) => p.operation === 'subtract')).toBe(true);
  });

  it('medium tier: add/subtract/multiply only; denominators ≤ 8', () => {
    const problems = sampleProblems('medium', 0.27, 0.09);
    for (const p of problems) {
      expect(['add', 'subtract', 'multiply']).toContain(p.operation);
      expect(['divide']).not.toContain(p.operation);
      expect(p.operand1.denominator).toBeLessThanOrEqual(8);
      expect(p.operand2.denominator).toBeLessThanOrEqual(8);
    }
    expect(problems.some((p) => p.operation === 'multiply')).toBe(true);
  });

  it('hard tier: all four ops appear; operands drawn from COMMON_FRACTIONS', () => {
    const commonKeys = new Set(COMMON_FRACTIONS.map(fracKey));
    const ops = new Set<string>();
    // Sweep several stepped streams so divide is not starved by one phase
    const streams: Array<[number, number]> = [
      [0.31, 0.05],
      [0.02, 0.03],
      [0.11, 0.037],
      [0.5, 0.11],
    ];
    for (const [seed, step] of streams) {
      mockSteppedRandom(seed, step);
      for (let i = 1; i <= 40; i++) {
        const p = generateProblem('hard', i);
        ops.add(p.operation);
        expect(['add', 'subtract', 'multiply', 'divide']).toContain(p.operation);
        expect(commonKeys.has(fracKey(p.operand1))).toBe(true);
        expect(commonKeys.has(fracKey(p.operand2))).toBe(true);
        expect(p.correctAnswer.denominator).toBeLessThanOrEqual(100);
        expect(p.correctAnswer.numerator).toBeLessThanOrEqual(100);
      }
      vi.restoreAllMocks();
    }
    expect(ops.has('add')).toBe(true);
    expect(ops.has('subtract')).toBe(true);
    expect(ops.has('multiply')).toBe(true);
    expect(ops.has('divide')).toBe(true);
  });

  it('createInitialState / startGame honor difficulty wiring for all tiers', () => {
    mockSteppedRandom(0.41, 0.13);
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const started = startFrac(createFrac(diff));
      expect(started.difficulty).toBe(diff);
      expect(started.currentProblem).not.toBeNull();
      if (diff === 'easy') {
        expect(['add', 'subtract']).toContain(
          started.currentProblem!.operation
        );
      }
      if (diff === 'medium') {
        expect(['add', 'subtract', 'multiply']).toContain(
          started.currentProblem!.operation
        );
      }
    }
  });

  it('operation symbols exist for every tier-legal op', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('Pinball challenge-number parity is the built-in type tier', () => {
    mockSteppedRandom(0.15, 0.12);
    for (let n = 0; n < 12; n++) {
      const c = generateChallenge(n);
      if (n % 2 === 0) {
        expect(c.type).toBe('fractionToDecimal');
        expect(formatDecimal(c.decimal)).toBe(c.correctAnswer);
      } else {
        expect(c.type).toBe('decimalToFraction');
        expect(c.answerChoices).toContain(c.correctAnswer);
        expect(typeof c.correctAnswer).toBe('string');
        expect(c.correctAnswer.includes('/') || /^\d+$/.test(c.correctAnswer)).toBe(
          true
        );
      }
      expect(c.answerChoices).toHaveLength(4);
      expect(c.answerChoices).toContain(c.correctAnswer);
    }
  });
});

// =============================================================================
// Duplicate-id prevention
// =============================================================================

describe('Overnight puzzle-generator — duplicate-id prevention', () => {
  it('Frac Fact problem ids are unique across a numbered batch', () => {
    mockSteppedRandom(0.33, 0.07);
    const ids = new Set<string>();
    for (let i = 1; i <= 20; i++) {
      const p = generateProblem('medium', i);
      expect(p.id).toBe(`problem-${i}`);
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
    }
    expect(ids.size).toBe(20);
  });

  it('Frac Fact answerChoices have unique simplified keys (no duplicate distractors)', () => {
    mockSteppedRandom(0.44, 0.06);
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      for (let i = 1; i <= 24; i++) {
        const p = generateProblem(diff, i);
        const keys = uniqueFracKeys(p.answerChoices);
        expect(keys.length).toBe(p.answerChoices.length);
        expect(keys).toContain(fracKey(p.correctAnswer));
      }
    }
  });

  it('startGame → nextProblem chain never reuses problem ids', () => {
    mockSteppedRandom(0.52, 0.08);
    let state = startFrac({
      ...createFrac('easy'),
      maxProblems: 6,
    });
    const ids = [state.currentProblem!.id];
    for (let step = 0; step < 5; step++) {
      const choice = state.currentProblem!.answerChoices[0]!;
      state = submitFrac(state, choice);
      state = nextProblem(state);
      if (state.phase === 'gameOver') break;
      expect(state.currentProblem).not.toBeNull();
      ids.push(state.currentProblem!.id);
    }
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe('problem-1');
    expect(ids).toContain('problem-2');
  });

  it('FIXED fixture ids stay distinct across the catalog', () => {
    const catalog = [
      FIXTURE_EASY_ADD.id,
      FIXTURE_MEDIUM_MUL.id,
      FIXTURE_HARD_DIV.id,
      FIXTURE_PIN_F2D.id,
      FIXTURE_PIN_D2F.id,
    ];
    expect(new Set(catalog).size).toBe(catalog.length);
  });

  it('Pinball challenge ids are unique and answerChoices strings are unique', () => {
    mockSteppedRandom(0.61, 0.09);
    const ids = new Set<string>();
    for (let i = 1; i <= 16; i++) {
      const c = generateChallenge(i);
      expect(c.id).toBe(`challenge-${i}`);
      expect(ids.has(c.id)).toBe(false);
      ids.add(c.id);
      expect(new Set(c.answerChoices).size).toBe(c.answerChoices.length);
      expect(c.answerChoices).toContain(c.correctAnswer);
    }
  });

  it('Pinball nextChallenge advances with non-colliding challenge ids', () => {
    mockSteppedRandom(0.18, 0.11);
    let state = startPin(createPin());
    const ids = [state.currentChallenge!.id];
    for (let i = 0; i < 4; i++) {
      const ans = state.currentChallenge!.answerChoices[0]!;
      state = submitPin(state, ans);
      state = nextChallenge(state);
      expect(state.phase).toBe('answering');
      ids.push(state.currentChallenge!.id);
    }
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual([
      'challenge-1',
      'challenge-2',
      'challenge-3',
      'challenge-4',
      'challenge-5',
    ]);
  });
});

// =============================================================================
// Seed determinism (Math.random is the coded entropy source)
// =============================================================================

describe('Overnight puzzle-generator — seed determinism', () => {
  it('same stepped seed reproduces Frac Fact generateProblem snapshot', () => {
    mockSteppedRandom(0.23, 0.07);
    const a = snapshotProblem(generateProblem('hard', 7));
    vi.restoreAllMocks();
    mockSteppedRandom(0.23, 0.07);
    const b = snapshotProblem(generateProblem('hard', 7));
    expect(b).toEqual(a);
  });

  it('different stepped seeds can diverge for Frac Fact', () => {
    mockSteppedRandom(0.1, 0.07);
    const a = snapshotProblem(generateProblem('medium', 4));
    vi.restoreAllMocks();
    mockSteppedRandom(0.73, 0.13);
    const b = snapshotProblem(generateProblem('medium', 4));
    // Same id shell, but operand/op/choices should differ under distant seeds
    expect(a.id).toBe(b.id);
    expect(
      a.operation !== b.operation ||
        fracKey(a.operand1) !== fracKey(b.operand1) ||
        fracKey(a.operand2) !== fracKey(b.operand2) ||
        JSON.stringify(a.answerChoices) !== JSON.stringify(b.answerChoices)
    ).toBe(true);
  });

  it('same seed reproduces across easy/medium/hard independently', () => {
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      mockSteppedRandom(0.35, 0.09);
      const first = snapshotProblem(generateProblem(diff, 2));
      vi.restoreAllMocks();
      mockSteppedRandom(0.35, 0.09);
      const second = snapshotProblem(generateProblem(diff, 2));
      expect(second).toEqual(first);
      vi.restoreAllMocks();
    }
  });

  it('same stepped seed reproduces Pinball generateChallenge snapshot', () => {
    mockSteppedRandom(0.29, 0.08);
    const a = snapshotChallenge(generateChallenge(5));
    vi.restoreAllMocks();
    mockSteppedRandom(0.29, 0.08);
    const b = snapshotChallenge(generateChallenge(5));
    expect(b).toEqual(a);
    expect(a.type).toBe('decimalToFraction');
  });

  it('same seed reproduces even and odd Pinball type tiers', () => {
    for (const n of [0, 1, 8, 9]) {
      mockSteppedRandom(0.47, 0.1);
      const first = snapshotChallenge(generateChallenge(n));
      vi.restoreAllMocks();
      mockSteppedRandom(0.47, 0.1);
      const second = snapshotChallenge(generateChallenge(n));
      expect(second).toEqual(first);
      vi.restoreAllMocks();
    }
  });

  it('Frac Fact formatFraction helper stays stable for fixture answers', () => {
    expect(formatFraction(FIXTURE_EASY_ADD.correctAnswer)).toBe('3/4');
    expect(formatFraction(FIXTURE_HARD_DIV.correctAnswer)).toBe('2');
    expect(formatPinFrac(FIXTURE_PIN_D2F.fraction)).toBe('1/4');
    expect(formatDecimal(FIXTURE_PIN_F2D.decimal)).toBe('0.5');
  });

  it('repeated generateProblem under one continuous seed stream yields unique ids', () => {
    mockSteppedRandom(0.05, 0.04);
    const batch = Array.from({ length: 15 }, (_, i) =>
      generateProblem('easy', i + 1)
    );
    expect(new Set(batch.map((p) => p.id)).size).toBe(15);
    for (const p of batch) {
      expect(uniqueFracKeys(p.answerChoices).length).toBe(
        p.answerChoices.length
      );
    }
  });
});

// =============================================================================
// Dense cross-tier stress (HEAVY)
// =============================================================================

describe('Overnight puzzle-generator — dense fixture stress', () => {
  it('200 Frac Fact problems across tiers keep id / choice / answer contracts', () => {
    mockSteppedRandom(0.08, 0.037);
    const tiers: Difficulty[] = ['easy', 'medium', 'hard'];
    let n = 0;
    for (const diff of tiers) {
      for (let i = 0; i < 70; i++) {
        n += 1;
        const p = generateProblem(diff, n);
        expect(p.id).toBe(`problem-${n}`);
        expect(p.answerChoices.length).toBe(4);
        expect(uniqueFracKeys(p.answerChoices).length).toBe(4);
        expect(checkAnswer(p, p.correctAnswer)).toBe(true);
        expect(
          checkAnswer(p, {
            numerator: p.correctAnswer.numerator + 11,
            denominator: Math.max(1, p.correctAnswer.denominator),
          })
        ).toBe(false);
      }
    }
    expect(n).toBe(210);
  });

  it('100 Pinball challenges keep id uniqueness and choice integrity', () => {
    mockSteppedRandom(0.14, 0.041);
    const ids = new Set<string>();
    for (let i = 1; i <= 100; i++) {
      const c = generateChallenge(i);
      expect(ids.has(c.id)).toBe(false);
      ids.add(c.id);
      expect(c.answerChoices.length).toBe(4);
      expect(new Set(c.answerChoices).size).toBe(4);
      expect(pinCheck(c, c.correctAnswer)).toBe(true);
      expect(pinCheck(c, `__not__${c.correctAnswer}`)).toBe(false);
    }
    expect(ids.size).toBe(100);
  });

  it('gameOver from maxProblems leaves currentProblem empty again', () => {
    mockSteppedRandom(0.2, 0.1);
    let state = startFrac({ ...createFrac('easy'), maxProblems: 1 });
    state = submitFrac(state, state.currentProblem!.correctAnswer);
    state = nextProblem(state);
    expect(state.phase).toBe('gameOver');
    expect(state.currentProblem).toBeNull();
    expect(state.winner).toBe('player1');
  });

  it('Pinball gameOver at maxRounds clears challenge (empty bank again)', () => {
    mockSteppedRandom(0.25, 0.1);
    let state = startPin({ ...createPin(), maxRounds: 1 });
    state = submitPin(state, state.currentChallenge!.correctAnswer);
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: state.maxRounds,
      player1Stats: { ...state.player1Stats, score: 40 },
      player2Stats: { ...state.player2Stats, score: 10 },
    };
    const over = nextChallenge(state);
    expect(over.phase).toBe('gameOver');
    expect(over.currentChallenge).toBeNull();
    expect(over.winner).toBe('player1');
  });
});
