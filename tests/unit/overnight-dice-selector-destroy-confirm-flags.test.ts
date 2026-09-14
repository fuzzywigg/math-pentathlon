/**
 * Overnight TOKENMAXX HEAVY — destroy leaves selector styles; confirm keeps selected.
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

describe('Overnight dice-selector — destroy style leak + post-confirm flags', () => {
  it('destroy clears container but leaves #dice-selector-styles', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    expect(document.getElementById('dice-selector-styles')).toBeTruthy();
    sel.destroy();
    expect(root.innerHTML).toBe('');
    expect(document.getElementById('dice-selector-styles')).toBeTruthy();
  });

  it('confirm locks selected dice while keeping isSelected true', () => {
    vi.useFakeTimers();
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      n += 1;
      return ((n * 23) % 83) / 83;
    });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, { diceSet: COMMON_DICE_SETS.standard });
    sel.roll();
    vi.advanceTimersByTime(900);
    const id = sel.getResult()!.rolls[0].id;
    (root.querySelector(`[data-die-id="${id}"]`) as HTMLElement).click();
    sel.confirm();
    const locked = sel.getResult()!.rolls.find((d) => d.id === id)!;
    expect(locked.isLocked).toBe(true);
    expect(locked.isSelected).toBe(true);
    sel.destroy();
  });
});
