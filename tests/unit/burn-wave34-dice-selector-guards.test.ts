/**
 * Wave 34 — DiceSelector rolling/locked click + missing resultArea leftovers.
 * Hits handleDieClick early-return and roll without #dice-result-area.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { DiceSelector, COMMON_DICE_SETS } from '../../src/core/dice';

function mockSteppedRandom() {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 997) / 997;
  });
}

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 34 dice-selector-guards — locked click early return', () => {
  it('mutating isLocked without re-render ignores subsequent click', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onSelectionChange = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.triple,
      onSelectionChange,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);

    const result = selector.getResult()!;
    const die = result.rolls[0];
    die.isLocked = true;
    const wrapper = el.querySelector(
      `[data-die-id="${die.id}"]`
    ) as HTMLElement;
    wrapper.click();
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(selector.getSelectedDice()).toHaveLength(0);
    selector.destroy();
  });
});

describe('Wave 34 dice-selector-guards — missing result area', () => {
  it('roll with removed result area leaves isRolling stuck without complete', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onRoll = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      onRollComplete: onRoll,
    });
    el.querySelector('#dice-result-area')?.remove();
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    expect(selector.getResult()).toBeNull();
    // Second roll ignored while isRolling remains true
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).not.toHaveBeenCalled();
    selector.destroy();
  });
});
