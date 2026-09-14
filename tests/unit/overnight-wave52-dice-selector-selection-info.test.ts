/**
 * Overnight HEAVY leftover after #234 — DiceSelector "N dice selected" panel.
 * Zero prior unit assertions on .dice-selection-label. Tests-only.
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

describe('Wave 52 dice-selector — selection info', () => {
  it('shows count label and selected sum after click', () => {
    vi.useFakeTimers();
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return ((n * 17) % 97) / 97;
    });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      multiSelect: true,
    });
    sel.roll();
    vi.advanceTimersByTime(900);
    const first = sel.getResult()!.rolls[0];
    (root.querySelector(`[data-die-id="${first.id}"]`) as HTMLElement).click();
    expect(root.querySelector('.dice-selection-label')?.textContent).toBe(
      '1 dice selected'
    );
    expect(root.querySelector('.dice-selection-sum')?.textContent).toBe(
      String(first.value)
    );
    sel.destroy();
  });
});
