/**
 * Wave 32 — DiceSelector roll / confirm / reset / customDice flow.
 * Deepens wave 22 selector smoke with possible-sums + custom dice paths.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  DiceSelector,
  COMMON_DICE_SETS,
  createRollButton,
} from '../../src/core/dice';

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

describe('Wave 32 dice-selector — customDice + autoRoll', () => {
  it('customDice overrides diceSet types on roll', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();

    const el = document.createElement('div');
    document.body.appendChild(el);
    const onRoll = vi.fn();

    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      customDice: [
        { type: 'd20', faces: 20, color: '#f44336' },
        { type: 'd4', faces: 4, color: '#e91e63' },
      ],
      autoRoll: false,
      onRollComplete: onRoll,
    });

    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).toHaveBeenCalledTimes(1);
    const result = selector.getResult();
    expect(result?.rolls.map((d) => d.diceType)).toEqual(['d20', 'd4']);
    selector.destroy();
  });

  it('autoRoll kicks off animation on mount', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onRoll = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.triple,
      autoRoll: true,
      onRollComplete: onRoll,
    });
    await vi.advanceTimersByTimeAsync(900);
    expect(onRoll).toHaveBeenCalled();
    expect(selector.getResult()?.rolls).toHaveLength(3);
    selector.destroy();
  });
});

describe('Wave 32 dice-selector — possible sums + confirm lock', () => {
  it('showPossibleSums renders chips after roll; confirm locks selection', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();

    const el = document.createElement('div');
    document.body.appendChild(el);
    const onConfirm = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      showPossibleSums: true,
      multiSelect: true,
      onConfirm,
    });

    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    expect(el.querySelector('.possible-sums')).toBeTruthy();
    expect(el.querySelectorAll('.possible-sum').length).toBeGreaterThan(0);

    const wrappers = el.querySelectorAll('.die-wrapper');
    expect(wrappers.length).toBe(2);
    (wrappers[0] as HTMLElement).click();
    expect(selector.getSelectedDice()).toHaveLength(1);

    selector.confirm();
    expect(onConfirm).toHaveBeenCalled();
    expect(selector.getResult()?.rolls.some((d) => d.isLocked)).toBe(true);

    selector.reset();
    expect(selector.getResult()).toBeNull();
    expect(el.querySelector('.dice-placeholder')).toBeTruthy();
    selector.destroy();
  });

  it('confirm with no selection is a no-op', async () => {
    vi.useFakeTimers();
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onConfirm = vi.fn();
    const selector = new DiceSelector(el, {
      diceSet: COMMON_DICE_SETS.standard,
      onConfirm,
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    selector.confirm();
    expect(onConfirm).not.toHaveBeenCalled();
    selector.destroy();
  });
});

describe('Wave 32 dice-selector — createRollButton', () => {
  it('invokes callback with rolled set length', () => {
    mockSteppedRandom();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onRoll = vi.fn();
    const btn = createRollButton(el, COMMON_DICE_SETS.primeGold, onRoll);
    expect(btn.textContent).toMatch(/Prime Gold/i);
    btn.click();
    expect(onRoll).toHaveBeenCalledTimes(1);
    expect(onRoll.mock.calls[0][0].rolls).toHaveLength(3);
  });
});
