/**
 * Overnight TOKENMAXX HEAVY — DiceSelector Roll Again label + confirm mid-roll leftover.
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

function sequencedRandom(): void {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return ((n * 17) % 97) / 97;
  });
}

describe('Overnight dice-selector — Roll Again + confirm mid-tumble', () => {
  it('button label flips to Roll Again after first settle', () => {
    vi.useFakeTimers();
    sequencedRandom();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      showRollButton: true,
    });
    expect(root.querySelector('.dice-btn-primary')?.textContent).toBe('Roll');
    sel.roll();
    vi.advanceTimersByTime(900);
    expect(root.querySelector('.dice-btn-primary')?.textContent).toBe(
      'Roll Again'
    );
    sel.destroy();
  });

  it('programmatic confirm during Roll Again can lock stale prior selection', () => {
    vi.useFakeTimers();
    sequencedRandom();
    const confirms: number[] = [];
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, {
      diceSet: COMMON_DICE_SETS.standard,
      onConfirm: (_dice, sum) => confirms.push(sum),
    });
    sel.roll();
    vi.advanceTimersByTime(900);
    const first = sel.getResult()!;
    const id = first.rolls[0].id;
    expect(new Set(first.rolls.map((d) => d.id)).size).toBe(2);
    (root.querySelector(`[data-die-id="${id}"]`) as HTMLElement).click();
    expect(sel.getSelectedDice()).toHaveLength(1);
    // Start re-roll — currentResult stays until onComplete
    sel.roll();
    expect(sel.getResult()?.id).toBe(first.id);
    sel.confirm();
    expect(confirms).toHaveLength(1);
    expect(sel.getResult()?.rolls.find((d) => d.id === id)?.isLocked).toBe(
      true
    );
    vi.advanceTimersByTime(900);
    sel.destroy();
  });
});
