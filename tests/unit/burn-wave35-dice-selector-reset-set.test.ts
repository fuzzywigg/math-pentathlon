/**
 * Wave 35 — DiceSelector reset / setDiceSet leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { DiceSelector, COMMON_DICE_SETS } from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 47) / 47;
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

describe('Wave 35 dice-selector-reset — lifecycle', () => {
  it('reset clears result; setDiceSet swaps header and clears', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(selector.getResult()).not.toBeNull();
    selector.reset();
    expect(selector.getResult()).toBeNull();
    expect(el.querySelector('.dice-placeholder')).toBeTruthy();

    selector.setDiceSet(COMMON_DICE_SETS.triple);
    expect(el.querySelector('.dice-selector-header')?.textContent).toMatch(
      /Triple/
    );
    expect(selector.getResult()).toBeNull();
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(selector.getResult()?.rolls).toHaveLength(3);
    selector.destroy();
  });
});
