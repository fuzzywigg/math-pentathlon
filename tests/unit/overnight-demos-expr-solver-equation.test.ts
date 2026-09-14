/**
 * Overnight TOKENMAXX HEAVY — expression demo 24-solver + equation checker leftovers.
 * Tests-only. No product inventing.
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

describe('Overnight demos — expression solver + equations', () => {
  it('default 1,2,3,4 solve lists exact solutions for 24', () => {
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#solutions-list')?.textContent).toMatch(/Searching/i);
    vi.advanceTimersByTime(20);
    const list = root.querySelector('#solutions-list');
    expect(list?.querySelectorAll('.solution-item').length).toBeGreaterThan(0);
    expect(list?.textContent).toMatch(/=/);
  });

  it('equation checker marks true / false / error classes', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#equation-input') as HTMLInputElement;
    const check = root.querySelector('#check-equation-btn') as HTMLButtonElement;
    const result = root.querySelector('#equation-result') as HTMLElement;

    input.value = '2 + 2 = 4';
    check.click();
    expect(result.classList.contains('true')).toBe(true);
    expect(result.textContent).toMatch(/True/i);

    input.value = '2 + 2 = 5';
    check.click();
    expect(result.classList.contains('false')).toBe(true);
    expect(result.textContent).toMatch(/False/i);

    input.value = '2 + =';
    check.click();
    expect(result.classList.contains('false')).toBe(true);
    expect(result.textContent).toMatch(/Error|False|≠/i);

    input.value = '';
    check.click();
    expect(result.innerHTML).toBe('');
  });
});
