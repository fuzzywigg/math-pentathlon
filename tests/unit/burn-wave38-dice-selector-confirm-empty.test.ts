/**
 * Wave 38 — DiceSelector confirm empty / null result leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { DiceSelector } from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS } from '../../src/core/dice';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 13) / 13;
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 38 dice-selector — confirm empty', () => {
  it('confirm with null result never calls onConfirm', () => {
    const onConfirm = vi.fn();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      autoRoll: false,
      onConfirm,
    });
    expect(sel.getResult()).toBeNull();
    sel.confirm();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(sel.getSelectedSum()).toBe(0);
    expect(sel.getSelectedDice()).toEqual([]);
  });

  it('confirm with roll but no selection never calls onConfirm', () => {
    const onConfirm = vi.fn();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      autoRoll: true,
      onConfirm,
    });
    vi.advanceTimersByTime(1000);
    expect(sel.getResult()).not.toBeNull();
    expect(sel.getSelectedDice()).toEqual([]);
    sel.confirm();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('reset after roll clears result and selection sum', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      autoRoll: true,
    });
    vi.advanceTimersByTime(1000);
    expect(sel.getResult()).not.toBeNull();
    sel.reset();
    expect(sel.getResult()).toBeNull();
    expect(sel.getSelectedSum()).toBe(0);
  });
});
