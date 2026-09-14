/**
 * Wave 56 leftover after #256 — Dice 2d6 Rolled:[…] Total:N log template.
 * Distinct from confirm checkmark / log-cap leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

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

describe('Wave 56 demos — dice Rolled format', () => {
  it('logs Rolled: [a, b] Total: N after 2d6 settle', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /^Roll$/i.test(b.textContent?.trim() ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const log = root.querySelector('#log-2d6')?.textContent ?? '';
    expect(log).toMatch(/Rolled: \[\d+(?:, \d+)+\] Total: \d+/);
  });
});
