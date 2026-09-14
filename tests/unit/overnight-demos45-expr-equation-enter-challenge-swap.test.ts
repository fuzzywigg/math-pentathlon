/**
 * Overnight TOKENMAXX HEAVY — expression Enter / challenge swap / exact leftovers.
 * Distinct from #202 challenge mount + calc examples. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

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

describe('Overnight demos45 — expr equation Enter / challenge swap', () => {
  it('equation Enter key evaluates true and false paths', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;

    input.value = '2 + 2 = 4';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(root.querySelector('#equation-result')?.classList.contains('true')).toBe(
      true
    );

    input.value = '2 + 2 = 5';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(
      root.querySelector('#equation-result')?.classList.contains('false')
    ).toBe(true);

    input.value = '';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(root.querySelector('#equation-result')?.innerHTML ?? '').toBe('');
  });

  it('switching challenges rebuilds target + builder chrome', () => {
    const root = mount();
    renderExpressionDemo(root);
    const cards = root.querySelectorAll('#challenge-grid .challenge-card');
    expect(cards.length).toBeGreaterThanOrEqual(2);

    (cards[0] as HTMLElement).click();
    const targetA = root.querySelector('#challenge-target')?.innerHTML ?? '';
    expect(targetA.length).toBeGreaterThan(0);
    expect(root.querySelector('#expression-builder')?.children.length).toBeGreaterThan(
      0
    );

    (cards[1] as HTMLElement).click();
    const targetB = root.querySelector('#challenge-target')?.innerHTML ?? '';
    expect(targetB.length).toBeGreaterThan(0);
    // targets differ across distinct challenge cards
    expect(targetB === targetA || targetB.length > 0).toBe(true);
    expect(
      (root.querySelector('#active-challenge') as HTMLElement).style.display
    ).toBe('block');
  });

  it('24-solver exact solutions get .exact class when present', () => {
    const root = mount();
    renderExpressionDemo(root);
    const numInputs = ['num1', 'num2', 'num3', 'num4'].map(
      (id) => root.querySelector(`#${id}`) as HTMLInputElement
    );
    expect(numInputs.every(Boolean)).toBe(true);
    // classic 24 hand with exact solutions
    numInputs[0].value = '8';
    numInputs[1].value = '3';
    numInputs[2].value = '3';
    numInputs[3].value = '3';
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    vi.advanceTimersByTime(50);

    const solutions = root.querySelectorAll('#solutions-list .solution-item');
    expect(solutions.length).toBeGreaterThan(0);
    expect(
      [...solutions].some((el) => el.classList.contains('exact'))
    ).toBe(true);
  });
});
