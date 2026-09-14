/**
 * Overnight TOKENMAXX HEAVY — customDice survives setDiceSet leftover.
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

describe('Overnight dice-selector — customDice + setDiceSet', () => {
  it('setDiceSet updates header but customDice still drives roll types', () => {
    vi.useFakeTimers();
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return ((n * 19) % 91) / 91;
    });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      customDice: [
        { type: 'd4', faces: 4 },
        { type: 'd4', faces: 4 },
        { type: 'd4', faces: 4 },
      ],
    });
    expect(root.querySelector('.dice-selector-header')?.textContent).toBe(
      'Standard (2d6)'
    );
    sel.setDiceSet(COMMON_DICE_SETS.polyhedral);
    expect(root.querySelector('.dice-selector-header')?.textContent).toBe(
      'Polyhedral Set'
    );
    sel.roll();
    vi.advanceTimersByTime(900);
    const result = sel.getResult()!;
    expect(result.rolls).toHaveLength(3);
    expect(result.rolls.every((d) => d.diceType === 'd4')).toBe(true);
    sel.destroy();
  });
});
