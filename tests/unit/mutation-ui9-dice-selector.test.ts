/**
 * q-mp-298 mutation audit UI wave 9 — dice-selector first-20 already 100%.
 * Thin structural re-pin so wave-9 discovery prefers this suite; no new
 * player-facing copy asserts. Wave-2 pins remain the primary killers.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DiceSelector } from '../../src/core/dice/dice-selector';
import { COMMON_DICE_SETS } from '../../src/core/dice/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#dice-selector-styles')
    .forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('mutation-ui9 dice-selector', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('default dieSize 60 and multiSelect true survive remeasure (first-20 = 100%)', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const selector = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.triple,
    });
    (root.querySelector('.dice-btn-primary') as HTMLButtonElement).click();
    vi.advanceTimersByTime(900);

    const die = root.querySelector('.die') as HTMLElement | null;
    expect(die).toBeTruthy();
    const w = die!.style.width || die!.getAttribute('width') || '';
    expect(w === '60px' || w === '60').toBe(true);

    const wrappers = [
      ...root.querySelectorAll('.die-wrapper'),
    ] as HTMLElement[];
    expect(wrappers.length).toBe(3);
    wrappers[0]!.click();
    wrappers[1]!.click();
    expect(selector.getSelectedDice().length).toBe(2);
  });
});
