import { describe, it, expect, vi, afterEach } from 'vitest';
import { Fraction } from '../../src/core/fractions/types';
import { areEquivalent } from '../../src/core/fractions/arithmetic';
import { FabADiffyState } from '../../src/games/fab-a-diffy/types';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  calculateResult,
  executeMove,
  passTurn,
  hasAnyValidMove,
  findMatchingAnswers,
  clearSelection,
  getOperationSymbol,
  formatMove,
  checkWinner,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function findBarId(state: FabADiffyState, fraction: Fraction): string {
  for (const [id, bar] of state.fractionBars) {
    if (
      !bar.used &&
      bar.fraction.numerator === fraction.numerator &&
      bar.fraction.denominator === fraction.denominator
    ) {
      return id;
    }
  }
  throw new Error(
    `missing bar ${fraction.numerator}/${fraction.denominator}`
  );
}

function findAnswerId(state: FabADiffyState, fraction: Fraction): string {
  for (const [id, answer] of state.answerBars) {
    if (
      answer.claimedBy === null &&
      areEquivalent(answer.fraction, fraction)
    ) {
      return id;
    }
  }
  throw new Error(
    `missing answer ${fraction.numerator}/${fraction.denominator}`
  );
}

describe('Fab-a-Diffy – createInitialState', () => {
  it('builds fraction and answer pools for player1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('selectingBar1');
    expect(state.currentPlayer).toBe('player1');
    expect(state.fractionBars.size).toBeGreaterThan(0);
    expect(state.answerBars.size).toBeGreaterThan(0);
    expect(state.scores).toEqual({ player1: 0, player2: 0 });
  });
});

describe('Fab-a-Diffy – calculateResult', () => {
  const half: Fraction = { numerator: 1, denominator: 2 };
  const third: Fraction = { numerator: 1, denominator: 3 };

  it('adds fractions', () => {
    expect(calculateResult(half, half, 'add')).toMatchObject({
      numerator: 1,
      denominator: 1,
    });
  });

  it('subtracts fractions', () => {
    expect(calculateResult(half, third, 'subtract')).toMatchObject({
      numerator: 1,
      denominator: 6,
    });
  });

  it('multiplies fractions', () => {
    expect(calculateResult(half, half, 'multiply')).toMatchObject({
      numerator: 1,
      denominator: 4,
    });
  });
});

describe('Fab-a-Diffy – selection / claim pipeline', () => {
  it('selects bars, operation, and claims a matching answer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();

    // 1/4 + 1/4 = 1/2 — both bars and answer exist in the standard sets
    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    // Need a second distinct 1/4 — there is only one 1/4. Use 1/2 + 1/2? Only one 1/2.
    // Use 1/3 + 1/6 = 1/2, or 1/4 + 1/4 unavailable.
    // 1/2 + 1/3? Not 1. Use 1/4 + 3/4 = 1.
    const barB = findBarId(state, { numerator: 3, denominator: 4 });
    const answerId = findAnswerId(state, { numerator: 1, denominator: 1 });

    state = selectBar1(state, barA);
    expect(state.phase).toBe('selectingBar2');
    expect(state.selectedBar1).toBe(barA);

    state = selectBar2(state, barB);
    expect(state.phase).toBe('selectingOperation');

    state = selectOperation(state, 'add');
    expect(state.phase).toBe('confirmingMove');
    expect(state.selectedOperation).toBe('add');

    const result = calculateResult(
      state.fractionBars.get(barA)!.fraction,
      state.fractionBars.get(barB)!.fraction,
      'add'
    )!;
    expect(findMatchingAnswers(state, result)).toContain(answerId);

    state = executeMove(state, answerId);
    expect(state.answerBars.get(answerId)?.claimedBy).toBe('player1');
    expect(state.fractionBars.get(barA)?.used).toBe(true);
    expect(state.fractionBars.get(barB)?.used).toBe(true);
    expect(state.scores.player1).toBe(1);
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('selectingBar1');
    expect(state.moveHistory).toHaveLength(1);
  });

  it('bad answer is a no-op', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    const barB = findBarId(state, { numerator: 3, denominator: 4 });
    state = selectBar1(state, barA);
    state = selectBar2(state, barB);
    state = selectOperation(state, 'add');

    // 1/4 + 3/4 = 1; claiming 1/2 should fail
    const wrong = findAnswerId(state, { numerator: 1, denominator: 2 });
    const before = state;
    expect(executeMove(state, wrong)).toBe(before);
  });

  it('executeMove is a no-op outside confirmingMove', () => {
    const state = createInitialState();
    expect(executeMove(state, 'answer-0')).toBe(state);
  });
});

describe('Fab-a-Diffy – passTurn / hasAnyValidMove', () => {
  it('passTurn advances to the opponent', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(hasAnyValidMove(state)).toBe(true);

    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
    expect(next.selectedBar1).toBeNull();
  });

  it('hasAnyValidMove is false when fewer than two bars remain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const bars = new Map(state.fractionBars);
    for (const [id, bar] of bars) {
      bars.set(id, { ...bar, used: true });
    }
    // Leave exactly one unused
    const firstId = bars.keys().next().value as string;
    bars.set(firstId, { ...bars.get(firstId)!, used: false });
    state = { ...state, fractionBars: bars };
    expect(hasAnyValidMove(state)).toBe(false);
  });
});

describe('Fab-a-Diffy – clearSelection / formatMove / helpers / winner', () => {
  it('clearSelection resets bars and phase', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    state = selectBar1(state, barA);
    const cleared = clearSelection(state);
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.selectedBar2).toBeNull();
    expect(cleared.phase).toBe('selectingBar1');
  });

  it('getOperationSymbol and getPossibleResults cover ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('multiply')).toBe('×');
    const half = { numerator: 1, denominator: 2 };
    const results = getPossibleResults(
      { id: 'a', fraction: half, used: false, owner: null },
      { id: 'b', fraction: half, used: false, owner: null }
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.operation === 'add')).toBe(true);
  });

  it('formatMove renders a completed claim', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    const barB = findBarId(state, { numerator: 3, denominator: 4 });
    const answerId = findAnswerId(state, { numerator: 1, denominator: 1 });
    state = selectBar1(state, barA);
    state = selectBar2(state, barB);
    state = selectOperation(state, 'add');
    state = executeMove(state, answerId);
    const move = state.moveHistory[0];
    expect(formatMove(state, move)).toMatch(/=/);
  });

  it('checkWinner returns a leader when all answers are claimed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const answers = new Map(state.answerBars);
    let i = 0;
    for (const [id, answer] of answers) {
      answers.set(id, {
        ...answer,
        claimedBy: i % 2 === 0 ? 'player1' : 'player2',
      });
      i++;
    }
    // Ensure player1 has more claims
    for (const [id, answer] of answers) {
      answers.set(id, { ...answer, claimedBy: 'player1' });
    }
    expect(checkWinner(answers, state.fractionBars)).toBe('player1');
    expect(checkWinner(state.answerBars, state.fractionBars)).toBeNull();
  });
});
