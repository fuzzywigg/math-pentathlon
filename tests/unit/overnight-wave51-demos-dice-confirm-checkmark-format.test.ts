/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — dice confirm checkmark format.
 * Distinct from demos46 /Confirmed/i soft match. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { renderDiceDemo } from '../../src/demos/dice-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('Wave 51 demos — dice confirm checkmark format', () => {
  it('onConfirm logs exact ✓ Confirmed sum line', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /Roll/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const dice = [...box.querySelectorAll('.die-wrapper')] as HTMLElement[];
    expect(dice.length).toBeGreaterThanOrEqual(2);
    dice[0].click();
    dice[1].click();

    const confirm = [...box.querySelectorAll('button')].find((b) =>
      /Confirm/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    confirm.click();

    expect(root.querySelector('#log-2d6')?.textContent ?? '').toMatch(
      /✓ Confirmed:.*\+.*=\s*\d/
    );
  });
});
