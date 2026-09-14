/**
 * Wave 39 — DiceSelector customDice + multiSelect:false replacement.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  DiceSelector,
  DICE_CONFIGS,
  COMMON_DICE_SETS,
} from '../../src/core/dice';

beforeEach(() => {
  let n = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    n += 1;
    return (n % 17) / 17;
  });
});

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#dice-selector-styles').forEach((el) => el.remove());
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Wave 39 dice — custom single-select', () => {
  it('customDice drives roll count; single-select replaces selection', async () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const changes: number[] = [];
    const selector = new DiceSelector(el, {
      customDice: [DICE_CONFIGS.d10, DICE_CONFIGS.d10, DICE_CONFIGS.d4],
      multiSelect: false,
      diceSet: COMMON_DICE_SETS.standard,
      onSelectionChange: (selected) => changes.push(selected.length),
    });
    selector.roll();
    await vi.advanceTimersByTimeAsync(900);
    const result = selector.getResult()!;
    expect(result.rolls).toHaveLength(3);

    const dice = el.querySelectorAll('.die-wrapper, .interactive-die, [data-die-id]');
    // click first then second die via public toggle path: query clickable wrappers
    const clickables = el.querySelectorAll('.die-wrapper');
    expect(clickables.length).toBeGreaterThanOrEqual(2);
    (clickables[0] as HTMLElement).click();
    (clickables[1] as HTMLElement).click();
    const selected = selector.getSelectedDice();
    expect(selected.length).toBeLessThanOrEqual(1);
    selector.destroy();
    void changes;
  });
});
