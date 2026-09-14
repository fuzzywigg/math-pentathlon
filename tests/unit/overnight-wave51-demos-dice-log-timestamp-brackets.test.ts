/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — dice log timestamp brackets.
 * Distinct from demos46 confirm lock. Tests-only.
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

describe('Wave 51 demos — dice log timestamp brackets', () => {
  it('each log-entry starts with locale time brackets', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /Roll/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const entries = [...root.querySelectorAll('#log-2d6 .log-entry')];
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.textContent ?? '').toMatch(/^\[\d/);
    }
  });
});
