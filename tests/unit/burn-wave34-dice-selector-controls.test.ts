/**
 * Wave 34 — DiceSelector control leftovers: showRollButton / confirm / setDiceSet.
 * Deepens wave 32 selector flow into unhit control branches after #158.
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

describe('Wave 34 dice-selector-controls — showRollButton false', () => {
  it('omits roll button but still rolls programmatically', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onRoll = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      showRollButton: false,
      onRollComplete: onRoll,
    });
    expect(el.querySelector('.dice-btn-primary')).toBeNull();
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).toHaveBeenCalledTimes(1);
    expect(selector.getResult()?.rolls).toHaveLength(2);
    // Confirm still present after roll
    expect(el.querySelector('.dice-btn-success')).toBeTruthy();
    selector.destroy();
  });
});

describe('Wave 34 dice-selector-controls — confirm / setDiceSet', () => {
  it('confirm before any roll is a no-op', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onConfirm = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.triple,
      onConfirm,
    });
    selector.confirm();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(selector.getResult()).toBeNull();
    expect(selector.getSelectedDice()).toEqual([]);
    expect(selector.getSelectedSum()).toBe(0);
    selector.destroy();
  });

  it('setDiceSet resets result and updates header name', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(selector.getResult()).not.toBeNull();

    selector.setDiceSet(COMMON_DICE_SETS.primeGold);
    expect(selector.getResult()).toBeNull();
    expect(el.querySelector('.dice-selector-header')?.textContent).toMatch(
      /Prime Gold/i
    );
    expect(el.querySelector('.dice-placeholder')).toBeTruthy();
    selector.destroy();
  });
});
