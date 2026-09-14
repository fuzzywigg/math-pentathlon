/**
 * Overnight TOKENMAXX HEAVY — expression demo challenge validateSolution+alert wiring.
 * Distinct from #220 equation Enter / swap and wave35 UI builder unit tests. Tests-only.
 *
 * Note: demo tray ships one of each operator, so MAKE_TEN 2+3+5 (two +) cannot complete
 * via UI; leftovers assert validateSolution gate + Clear All / near-miss wiring.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function trayCards(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll('#expression-builder .card-tray .expression-card'),
  ] as HTMLElement[];
}

function slots(root: HTMLElement): HTMLElement[] {
  return [
    ...root.querySelectorAll('#expression-builder .expression-slot'),
  ] as HTMLElement[];
}

function place(
  root: HTMLElement,
  content: string,
  slotIndex: number
): void {
  trayCards(root)
    .find((el) => el.textContent === content)!
    .click();
  slots(root)[slotIndex].click();
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight demos46 — expr challenge Correct alert', () => {
  it('target hit without all numbers paints ✓ but validateSolution blocks alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const root = mount();
    renderExpressionDemo(root);

    (root.querySelector('#challenge-grid .challenge-card') as HTMLElement).click();
    expect(slots(root).length).toBe(5);

    // 2 * 5 = 10 hits target but omits 3 → useAllNumbers fails in validateSolution
    place(root, '2', 0);
    place(root, '*', 1);
    place(root, '5', 2);

    expect(
      root.querySelector('#expression-builder .expression-result')?.textContent
    ).toMatch(/10/);
    expect(
      root.querySelector('#expression-builder .expression-result')?.textContent
    ).toMatch(/✓/);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('near-miss expression evaluates but does not alert', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#challenge-grid .challenge-card') as HTMLElement).click();

    // 2 + 3 - 5 = 0 ≠ 10
    place(root, '2', 0);
    place(root, '+', 1);
    place(root, '3', 2);
    place(root, '-', 3);
    place(root, '5', 4);

    expect(alertSpy).not.toHaveBeenCalled();
    expect(
      root.querySelector('#expression-builder .expression-result')?.textContent
    ).toMatch(/0|target/i);
  });

  it('Clear All empties challenge builder slots after partial place', () => {
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#challenge-grid .challenge-card') as HTMLElement).click();

    place(root, '2', 0);
    expect(
      slots(root).some((s) => s.querySelector('.expression-card'))
    ).toBe(true);
    expect(
      root.querySelector('#expression-builder')?.textContent
    ).toMatch(/Click a slot|Select a card/i);

    const clear = [...root.querySelectorAll('#expression-builder button')].find(
      (b) => /Clear All/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(clear).toBeTruthy();
    clear.click();

    expect(
      slots(root).every((s) => !s.querySelector('.expression-card'))
    ).toBe(true);
    expect(trayCards(root).length).toBeGreaterThanOrEqual(5);
  });
});
