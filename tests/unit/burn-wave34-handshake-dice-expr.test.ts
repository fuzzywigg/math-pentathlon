/**
 * Wave 34 — dice ↔ expression handshake leftover after #158 graph-ui wave.
 * Cross-cuts existing roller totals into expression slot evaluation.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  rollDice,
  selectDice,
  getSelectedValues,
  getSelectedTotal,
  getAllPossibleSums,
  COMMON_DICE_SETS,
} from '../../src/core/dice';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  validateSlots,
  slotsToExpression,
  createTargetChallenge,
  solveTargetChallenge,
} from '../../src/core/expressions';

afterEach(() => {
  vi.restoreAllMocks();
});

function steppedRandom() {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
}

describe('Wave 34 handshake — dice selection feeds expression slots', () => {
  it('selected dice values build an additive expression matching selected total', () => {
    steppedRandom();
    let result = rollDice({
      dice: COMMON_DICE_SETS.triple.dice.map((d) => d.type),
    });
    const ids = result.rolls.slice(0, 2).map((d) => d.id);
    expect(new Set(ids).size).toBe(2);
    result = selectDice(result, ids, true);

    const values = getSelectedValues(result);
    expect(values).toHaveLength(2);
    const sum = getSelectedTotal(result);

    const slots = [
      createSlot(0, createNumberCard(values[0], 'a')),
      createSlot(1, createOperatorCard('+', 'op')),
      createSlot(2, createNumberCard(values[1], 'b')),
    ];
    const validation = validateSlots(slots);
    expect(validation.canEvaluate).toBe(true);
    expect(validation.result).toBe(sum);
    expect(slotsToExpression(slots)).toBe(`${values[0]} + ${values[1]}`);
  });

  it('full-roll sum is solvable via + across all dice values', () => {
    steppedRandom();
    const result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    const values = result.rolls.map((d) => d.value);
    const sums = getAllPossibleSums(values);
    expect(sums).toContain(values.reduce((a, b) => a + b, 0));

    const target = values.reduce((a, b) => a + b, 0);
    const challenge = createTargetChallenge(values, target, {
      operators: ['+'],
      useAllNumbers: true,
      useEachOnce: true,
    });
    const sols = solveTargetChallenge(challenge, 20);
    expect(sols.some((s) => s.isExact && s.result === target)).toBe(true);
  });
});
