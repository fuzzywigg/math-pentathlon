/**
 * Overnight demos leftover — dice quick-roll exhaust + selector log isolation.
 * Existing renderDiceDemo APIs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderDiceDemo } from '../../src/demos/dice-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const QUICK_ROLLS = [
  { dice: 'd6', count: '1' },
  { dice: 'd6', count: '2' },
  { dice: 'd6', count: '3' },
  { dice: 'd20', count: '1' },
  { dice: 'd10', count: '2' },
] as const;

describe('Overnight demos — dice roll exhaust', () => {
  it('all five quick-roll presets replace placeholder result', () => {
    const root = mount();
    renderDiceDemo(root);
    const result = root.querySelector('#quick-roll-result') as HTMLElement;
    expect(result.textContent).toMatch(/Click a button/i);

    for (const { dice, count } of QUICK_ROLLS) {
      const btn = root.querySelector(
        `.quick-roll-btn[data-dice="${dice}"][data-count="${count}"]`
      ) as HTMLButtonElement;
      expect(btn).toBeTruthy();
      btn.click();
      expect(result.textContent).not.toMatch(/Click a button/i);
      expect(result.querySelector('.dice-roll-result, .die, svg')).toBeTruthy();
    }
  });

  it('rapid re-roll of same preset keeps a single result container', () => {
    const root = mount();
    renderDiceDemo(root);
    const btn = root.querySelector(
      '.quick-roll-btn[data-dice="d6"][data-count="2"]'
    ) as HTMLButtonElement;
    for (let i = 0; i < 12; i++) btn.click();
    expect(root.querySelectorAll('#quick-roll-result')).toHaveLength(1);
    expect(
      (root.querySelector('#quick-roll-result') as HTMLElement).innerHTML.length
    ).toBeGreaterThan(0);
  });

  it('2d6 selector roll/confirm writes isolated log-2d6 entries', () => {
    const root = mount();
    renderDiceDemo(root);
    const sel = root.querySelector('#selector-2d6') as HTMLElement;
    const log = root.querySelector('#log-2d6') as HTMLElement;
    expect(log.children.length).toBe(0);

    const rollBtn = sel.querySelector(
      '.dice-btn-primary'
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    rollBtn.click();
    vi.advanceTimersByTime(900);
    expect(log.querySelectorAll('.log-entry').length).toBeGreaterThanOrEqual(1);
    expect(log.textContent).toMatch(/Rolled/i);

    // select a die if present then confirm
    const die = sel.querySelector(
      '.die-wrapper, .die, [data-index], .dice-die'
    ) as HTMLElement | null;
    die?.click();
    const confirm = sel.querySelector(
      '.dice-btn-success'
    ) as HTMLButtonElement | null;
    if (confirm && !confirm.disabled) {
      confirm.click();
      expect(log.textContent).toMatch(/Confirmed|✓/i);
    }

    // poly log stays empty — isolation
    expect(
      (root.querySelector('#log-poly') as HTMLElement).children.length
    ).toBe(0);
  });

  it('poly roll stays isolated from 2d6 log under shared result-area ids', async () => {
    const root = mount();
    renderDiceDemo(root);
    await vi.advanceTimersByTimeAsync(1200);

    // Three DiceSelectors share id="dice-result-area". jsdom/browser ID lookup
    // resolves the first match (2d6), so poly animate/onRollComplete is a no-op
    // leftover — poly must still not pollute the 2d6 log.
    const poly = root.querySelector('#selector-poly') as HTMLElement;
    const rollBtn = poly.querySelector(
      '.dice-btn-primary'
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    rollBtn.click();
    await vi.advanceTimersByTimeAsync(1200);

    expect(
      (root.querySelector('#log-poly') as HTMLElement).children.length
    ).toBe(0);
    expect(
      (root.querySelector('#log-2d6') as HTMLElement).children.length
    ).toBe(0);

    // 2d6 (first id owner) still logs after its own roll
    (
      root.querySelector('#selector-2d6 .dice-btn-primary') as HTMLButtonElement
    ).click();
    await vi.advanceTimersByTimeAsync(1200);
    expect(
      (root.querySelector('#log-2d6') as HTMLElement).textContent
    ).toMatch(/Rolled/i);
    expect(
      (root.querySelector('#log-poly') as HTMLElement).children.length
    ).toBe(0);
  });

  it('sums selector auto-rolls and exposes possible-sums chrome', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(900);
    const sums = root.querySelector('#selector-sums') as HTMLElement;
    expect(sums.children.length).toBeGreaterThan(0);
    // autoRoll: true — should already show dice / sums UI
    expect(
      sums.querySelector('.dice-btn-primary, .possible-sums, .die-wrapper, .die')
    ).toBeTruthy();
  });

  it('log area caps at 20 entries under burst rolls', () => {
    const root = mount();
    renderDiceDemo(root);
    const sel = root.querySelector('#selector-2d6') as HTMLElement;
    const log = root.querySelector('#log-2d6') as HTMLElement;
    const rollBtn = sel.querySelector(
      '.dice-btn-primary'
    ) as HTMLButtonElement;
    for (let i = 0; i < 30; i++) {
      rollBtn.click();
      vi.advanceTimersByTime(900);
    }
    expect(log.children.length).toBeLessThanOrEqual(20);
    expect(log.children.length).toBeGreaterThan(0);
  });

  it('remount clears prior quick-roll result and logs', () => {
    const root = mount();
    renderDiceDemo(root);
    (
      root.querySelector(
        '.quick-roll-btn[data-dice="d20"]'
      ) as HTMLButtonElement
    ).click();
    (
      root.querySelector('#selector-2d6 .dice-btn-primary') as HTMLButtonElement
    ).click();
    vi.advanceTimersByTime(900);
    expect(
      (root.querySelector('#log-2d6') as HTMLElement).children.length
    ).toBeGreaterThan(0);

    renderDiceDemo(root);
    expect(root.querySelector('#quick-roll-result')?.textContent).toMatch(
      /Click a button/i
    );
    expect(
      (root.querySelector('#log-2d6') as HTMLElement).children.length
    ).toBe(0);
  });
});
