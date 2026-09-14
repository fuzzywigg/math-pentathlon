/**
 * Overnight TOKENMAXX HEAVY — dice demo Roll Again + post-confirm lock leftovers.
 * Distinct from #220 confirm-empty / poly chrome. Tests-only.
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

describe('Overnight demos46 — dice Roll Again / confirm lock', () => {
  it('primary button flips to Roll Again after first 2d6 settle', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /^Roll$/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const again = box.querySelector('.dice-btn-primary') as HTMLButtonElement;
    expect(again.textContent).toMatch(/Roll Again/i);
  });

  it('locked die after confirm ignores further toggle clicks', () => {
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
    die.click();
    expect(root.querySelector('#log-2d6')?.textContent).toMatch(
      /Selection changed/i
    );

    const confirm = [...box.querySelectorAll('button')].find((b) =>
      /Confirm/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    confirm.click();
    expect(root.querySelector('#log-2d6')?.textContent).toMatch(/Confirmed/i);

    // confirm re-renders die wrappers — re-query locked die
    const locked = box.querySelector('.die-wrapper') as HTMLElement;
    const before = root.querySelectorAll('#log-2d6 .log-entry').length;
    locked.click();
    expect(root.querySelectorAll('#log-2d6 .log-entry').length).toBe(before);
  });
});
