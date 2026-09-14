/**
 * Overnight TOKENMAXX HEAVY — DiceSelector reset + getSelectedSum empty leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DiceSelector } from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS } from '../../src/core/dice/types';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('dice-selector-styles')?.remove();
});

describe('Overnight dice-selector — reset clears result helpers', () => {
  it('reset restores placeholder; getters return empty/0', () => {
    vi.useFakeTimers();
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return ((n * 29) % 79) / 79;
    });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    expect(sel.getResult()).toBeNull();
    expect(sel.getSelectedSum()).toBe(0);
    sel.roll();
    vi.advanceTimersByTime(900);
    expect(sel.getResult()).not.toBeNull();
    sel.reset();
    expect(sel.getResult()).toBeNull();
    expect(sel.getSelectedDice()).toEqual([]);
    expect(sel.getSelectedSum()).toBe(0);
    expect(root.querySelector('.dice-placeholder')?.textContent).toMatch(
      /Roll/
    );
    sel.destroy();
  });
});
