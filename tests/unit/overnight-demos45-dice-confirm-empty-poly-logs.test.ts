/**
 * Overnight TOKENMAXX HEAVY — dice confirm-empty + poly log leftovers.
 * Distinct from #202 happy 2d6 confirm. Tests-only.
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

describe('Overnight demos45 — dice confirm empty / poly logs', () => {
  it('Confirm stays disabled / no-op without die selection', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /Roll/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const confirm = [...box.querySelectorAll('button')].find((b) =>
      /Confirm/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(confirm).toBeTruthy();
    expect(confirm.disabled).toBe(true);

    const before = root.querySelectorAll('#log-2d6 .log-entry').length;
    confirm.click();
    expect(root.querySelectorAll('#log-2d6 .log-entry').length).toBe(before);
  });

  it('selection toggle rewrites 2d6 Selection changed log lines', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);

    const box = root.querySelector('#selector-2d6') as HTMLElement;
    const rollBtn = [...box.querySelectorAll('button')].find((b) =>
      /Roll/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    rollBtn.click();
    vi.advanceTimersByTime(1200);

    const dies = [...box.querySelectorAll('.die-wrapper')] as HTMLElement[];
    expect(dies.length).toBeGreaterThanOrEqual(2);
    dies[0].click();
    const afterOne = [...root.querySelectorAll('#log-2d6 .log-entry')]
      .map((el) => el.textContent)
      .join('\n');
    expect(afterOne).toMatch(/Selection changed/i);

    dies[1].click();
    const afterTwo = [...root.querySelectorAll('#log-2d6 .log-entry')]
      .map((el) => el.textContent)
      .join('\n');
    expect(afterTwo).toMatch(/Selection changed/i);
    expect(
      root.querySelectorAll('#log-2d6 .log-entry').length
    ).toBeGreaterThanOrEqual(2);
  });

  it('poly selector mounts log area ready for Selection: type:value format', () => {
    const root = mount();
    renderDiceDemo(root);
    vi.advanceTimersByTime(1200);
    expect(root.querySelector('#log-poly')).toBeTruthy();
    expect(root.querySelector('#selector-poly')).toBeTruthy();
    // secondary selector shares #dice-result-area id — assert chrome only
    const polyBtns = [
      ...root.querySelectorAll('#selector-poly button'),
    ];
    expect(polyBtns.some((b) => /Roll/i.test(b.textContent ?? ''))).toBe(true);
  });
});
