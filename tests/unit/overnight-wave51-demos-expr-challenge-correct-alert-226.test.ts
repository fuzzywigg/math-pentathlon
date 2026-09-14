/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — MAKE_TEN [2,2,6] Correct alert.
 * Distinct from demos46 near-miss / incomplete validateSolution gate. Tests-only.
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

function place(root: HTMLElement, content: string, slotIndex: number): void {
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

describe('Wave 51 demos — expr challenge Correct alert 2*6-2', () => {
  it('MAKE_TEN [2,2,6] with 2 * 6 - 2 alerts Correct!', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const root = mount();
    renderExpressionDemo(root);

    // MAKE_TEN order: [2,3,5], [1,4,5], [2,2,6] → index 2
    const cards = root.querySelectorAll('#challenge-grid .challenge-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
    (cards[2] as HTMLElement).click();
    expect(slots(root).length).toBe(5);

    place(root, '2', 0);
    place(root, '*', 1);
    place(root, '6', 2);
    place(root, '-', 3);
    place(root, '2', 4);

    expect(alertSpy).toHaveBeenCalled();
    expect(String(alertSpy.mock.calls[0]?.[0] ?? '')).toMatch(/Correct!/);
  });
});
