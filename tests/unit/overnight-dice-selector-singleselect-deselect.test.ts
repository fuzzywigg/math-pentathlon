/**
 * Overnight TOKENMAXX HEAVY — DiceSelector singleSelect deselect-others leftover.
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

describe('Overnight dice-selector — singleSelect deselect others', () => {
  it('selecting second die clears first in singleSelect mode', () => {
    vi.useFakeTimers();
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return ((n * 13) % 89) / 89;
    });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.triple,
      multiSelect: false,
    });
    sel.roll();
    vi.advanceTimersByTime(900);
    const ids = sel.getResult()!.rolls.map((d) => d.id);
    expect(new Set(ids).size).toBe(3);
    (root.querySelector(`[data-die-id="${ids[0]}"]`) as HTMLElement).click();
    expect(sel.getSelectedDice().map((d) => d.id)).toEqual([ids[0]]);
    (root.querySelector(`[data-die-id="${ids[1]}"]`) as HTMLElement).click();
    expect(sel.getSelectedDice().map((d) => d.id)).toEqual([ids[1]]);
    (root.querySelector(`[data-die-id="${ids[1]}"]`) as HTMLElement).click();
    expect(sel.getSelectedDice()).toHaveLength(0);
    sel.destroy();
  });
});
