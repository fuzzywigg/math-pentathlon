/**
 * Wave 55 leftover after #250 — Dice demo log keeps last 20 entries.
 * Distinct from wave51 newest-first / timestamp leftovers. Tests-only.
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

describe('Wave 55 demos — dice log cap 20', () => {
  it('trims #log-2d6 to 20 after many rolls', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /Roll/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const die = box.querySelector('.die-wrapper') as HTMLElement;
    expect(die).toBeTruthy();
    for (let i = 0; i < 24; i++) {
      die.click();
    }

    expect(root.querySelectorAll('#log-2d6 .log-entry').length).toBe(20);
    expect(box.querySelectorAll('#log-2d6 .log-entry').length).toBe(0);
  });
});
