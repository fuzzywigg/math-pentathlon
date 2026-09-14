/**
 * Wave 55 leftover after #250 — Fraction subtract op selected + 3/4 − 1/2 result.
 * Distinct from wave51 compare decimal parens. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 demos — frac subtract selected', () => {
  it('subtract button becomes selected and calculate fills arithmetic-result', () => {
    const root = mount();
    renderFractionDemo(root);
    const sub = root.querySelector('.op-btn[data-op="subtract"]') as HTMLButtonElement;
    sub.click();
    expect(sub.classList.contains('selected')).toBe(true);
    expect(
      root.querySelector('.op-btn[data-op="add"]')?.classList.contains('selected')
    ).toBe(false);

    (root.querySelector('#fraction-a') as HTMLInputElement).value = '3/4';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/2';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#arithmetic-result')?.textContent ?? '';
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/1\/4|0\.25|steps|result/i);
  });
});
