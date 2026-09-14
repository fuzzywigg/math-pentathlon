/**
 * Overnight TOKENMAXX HEAVY — dice demo selector roll / select / confirm logs.
 * Uses fake timers for animateRoll. Only rolls the first selector (2d6): demos
 * reuse duplicate #dice-result-area ids, so later selectors' querySelector('#…')
 * can miss their result area under jsdom. Tests-only.
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

describe('Overnight demos — dice selector roll/confirm logs', () => {
  it('2d6 roll + die select + confirm appends log entries', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200); // drain sums autoRoll

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /Roll/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const die = box.querySelector('.die-wrapper') as HTMLElement;
    expect(die).toBeTruthy();
    die.click();

    const confirm = [...box.querySelectorAll('button')].find((b) =>
      /Confirm/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(confirm).toBeTruthy();
    expect(confirm.disabled).toBe(false);
    confirm.click();

    const logs = root.querySelectorAll('#log-2d6 .log-entry');
    expect(logs.length).toBeGreaterThanOrEqual(2);
    const joined = [...logs].map((el) => el.textContent).join('\n');
    expect(joined).toMatch(/Rolled|Selection|Confirmed/i);
  });

  it('poly + sums selectors mount controls without rolling secondary ids', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const poly = root.querySelector('#selector-poly') as HTMLElement;
    expect(
      [...poly.querySelectorAll('button')].some((b) => /Roll/i.test(b.textContent ?? ''))
    ).toBe(true);
    expect(root.querySelector('#log-poly')).toBeTruthy();

    const sums = root.querySelector('#selector-sums') as HTMLElement;
    expect(sums.children.length).toBeGreaterThan(0);
    expect(sums.querySelector('.dice-selector, .dice-btn, .possible-sums')).toBeTruthy();
  });
});
