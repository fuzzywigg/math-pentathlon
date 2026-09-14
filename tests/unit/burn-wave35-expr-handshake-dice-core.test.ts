/**
 * Wave 35 — dice roll values → expression target handshake (core only).
 * Distinct from #161 UI handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollDice,
  getSelectedValues,
  selectDice,
  getAllPossibleSums,
  getTwoDiceResults,
} from '../../src/core/dice';
import {
  createTargetChallenge,
  validateSolution,
  evaluate,
  solveTargetChallenge,
} from '../../src/core/expressions';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 61) / 61;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 35 handshake — selected dice as challenge numbers', () => {
  it('sum of two selected dice validates as + expression', () => {
    let result = rollDice({ dice: ['d6', 'd6'] });
    result = selectDice(
      result,
      result.rolls.map((d) => d.id),
      true
    );
    const values = getSelectedValues(result);
    expect(values).toHaveLength(2);
    const [a, b] = values;
    const challenge = createTargetChallenge([a, b], a + b, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    expect(validateSolution(`${a}+${b}`, challenge)).toEqual({ valid: true });
    expect(evaluate(`${a}+${b}`)).toEqual({ success: true, value: a + b });
  });

  it('two-dice map products appear in subset products / solve', () => {
    let result = rollDice({ dice: ['d6', 'd6'] });
    const [a, b] = result.rolls.map((d) => d.value);
    const map = getTwoDiceResults(a, b);
    const product = map.get(`${a} × ${b}`)!;
    const challenge = createTargetChallenge([a, b], product, {
      operators: ['*'],
      useAllNumbers: true,
    });
    const sols = solveTargetChallenge(challenge, 10);
    expect(sols.some((s) => s.isExact)).toBe(true);
    expect(getAllPossibleSums([a, b])).toEqual(
      [...new Set([a, b, a + b])].sort((x, y) => x - y)
    );
  });
});
