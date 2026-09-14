/**
 * Wave 32 — roller ↔ selector ↔ sums handshake stress.
 * Cross-cuts existing dice APIs without inventing product behavior.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  rollDice,
  selectDice,
  getSelectedValues,
  getSelectedTotal,
  getAllPossibleSums,
  getAllPossibleProducts,
  getTwoDiceResults,
  lockDice,
  rerollDice,
  COMMON_DICE_SETS,
  DiceSelector,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 32 dice-handshake — roller math ↔ selection', () => {
  it('selected total is always a member of possible subset sums', () => {
    for (const set of Object.values(COMMON_DICE_SETS)) {
      let result = rollDice({ dice: set.dice.map((d) => d.type) });
      const values = result.rolls.map((d) => d.value);
      const sums = getAllPossibleSums(values);
      // select first half
      const ids = result.rolls.slice(0, Math.ceil(result.rolls.length / 2)).map((d) => d.id);
      result = selectDice(result, ids, true);
      const selected = getSelectedValues(result);
      if (selected.length > 0) {
        expect(sums).toContain(getSelectedTotal(result));
      }
    }
  });

  it('two-dice map covers selected pair after lock/reroll of third', () => {
    let result = rollDice({ dice: ['d6', 'd6', 'd6'] });
    const keep = result.rolls.slice(0, 2);
    result = lockDice(
      result,
      keep.map((d) => d.id)
    );
    result = rerollDice(result, [result.rolls[2].id]);
    const [a, b] = keep.map((d) => d.value);
    const map = getTwoDiceResults(a, b);
    expect(map.get(`${a} + ${b}`)).toBe(a + b);
    expect(getAllPossibleProducts([a, b])).toContain(a * b);
  });
});

describe('Wave 32 dice-handshake — selector uses roller totals', () => {
  it('getSelectedSum matches getSelectedTotal after clicks', async () => {
    vi.useFakeTimers();
    // Keep stepped random (from beforeEach) so die ids stay unique.
    const el = document.createElement('div');
    document.body.appendChild(el);
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      multiSelect: true,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    const wrappers = el.querySelectorAll('.die-wrapper');
    expect(wrappers.length).toBe(2);
    (wrappers[0] as HTMLElement).click();
    (wrappers[1] as HTMLElement).click();
    const result = selector.getResult()!;
    expect(selector.getSelectedDice()).toHaveLength(2);
    expect(selector.getSelectedSum()).toBe(getSelectedTotal(result));
    expect(selector.getSelectedSum()).toBe(result.total);
    selector.destroy();
  });
});
