/**
 * Wave 56 leftover after #256 — Poly ✓ Confirmed sum: N format (demo wiring).
 * Full renderDiceDemo mount leaves poly Roll inert (duplicate #dice-result-area
 * across selectors); mirrors dice-demo primeGold callbacks in isolation. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DiceSelector, COMMON_DICE_SETS } from '../../src/core/dice';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('Wave 56 demos — dice poly confirmed sum', () => {
  it('mirrors demo Selection + ✓ Confirmed sum: N log templates', () => {
    const box = document.createElement('div');
    const logPoly = document.createElement('div');
    logPoly.id = 'log-poly';
    document.body.append(box, logPoly);

    // Same templates as src/demos/dice-demo.ts poly DiceSelector callbacks
    new DiceSelector(box, {
      diceSet: COMMON_DICE_SETS.primeGold,
      multiSelect: true,
      onSelectionChange: (dice, sum) => {
        logPoly.textContent = `Selection: ${dice
          .map((d) => `${d.diceType}:${d.value}`)
          .join(', ')} = ${sum}`;
      },
      onConfirm: (_dice, sum) => {
        logPoly.textContent = `✓ Confirmed sum: ${sum}`;
      },
    });

    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /^Roll$/i.test(b.textContent?.trim() ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const die = box.querySelector('.die-wrapper') as HTMLElement;
    expect(die).toBeTruthy();
    die.click();
    expect(logPoly.textContent).toMatch(/Selection:.*\w+:\d+/);

    const confirm = [...box.querySelectorAll('button')].find((b) =>
      /Confirm/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    confirm.click();
    expect(logPoly.textContent).toMatch(/✓ Confirmed sum:\s*\d+/);
  });
});
