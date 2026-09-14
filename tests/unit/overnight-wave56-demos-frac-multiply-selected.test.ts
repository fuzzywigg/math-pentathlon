/**
 * Wave 56 leftover after #256 — Fraction multiply selected + product result.
 * Distinct from wave55 subtract leftover. Tests-only.
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

describe('Wave 56 demos — frac multiply selected', () => {
  it('multiply becomes selected and calculate fills arithmetic-result', () => {
    const root = mount();
    renderFractionDemo(root);
    const mul = root.querySelector(
      '.op-btn[data-op="multiply"]'
    ) as HTMLButtonElement;
    mul.click();
    expect(mul.classList.contains('selected')).toBe(true);
    expect(
      root.querySelector('.op-btn[data-op="add"]')?.classList.contains('selected')
    ).toBe(false);

    (root.querySelector('#fraction-a') as HTMLInputElement).value = '1/2';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/3';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    const result = root.querySelector('#arithmetic-result')?.textContent ?? '';
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/1\/6|0\.166|steps|result/i);
  });
});
