/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — dice log newest-first order.
 * Distinct from demos46 Roll Again / confirm lock. Tests-only.
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

describe('Wave 51 demos — dice log newest-first', () => {
  it('insertBefore keeps latest Rolled/Selection entry as firstChild', () => {
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
    die.click();

    const log = root.querySelector('#log-2d6') as HTMLElement;
    const entries = [...log.querySelectorAll('.log-entry')];
    expect(entries.length).toBeGreaterThanOrEqual(2);
    expect(entries[0].textContent).toMatch(/Selection changed|Rolled/i);
    // Newest is first; older Rolled/Selection sits below
    expect(log.firstElementChild).toBe(entries[0]);
    expect(entries[0].textContent).not.toBe(entries[1].textContent);
  });
});
