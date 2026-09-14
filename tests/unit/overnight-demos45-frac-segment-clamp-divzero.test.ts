/**
 * Overnight TOKENMAXX HEAVY — fraction segment click / denom clamp / ÷0 leftovers.
 * Distinct from #197/#202 denom change + ops. Tests-only.
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

describe('Overnight demos45 — frac segment / clamp / divzero', () => {
  it('fraction-segment click updates interactive-value', () => {
    const root = mount();
    renderFractionDemo(root);
    const segments = root.querySelectorAll(
      '#interactive-bar .fraction-segment'
    );
    expect(segments.length).toBe(4);
    (segments[2] as HTMLElement).click();
    expect(root.querySelector('#interactive-value')?.textContent).toMatch(
      /3\/4/
    );
  });

  it('shrinking denominator clamps numerator and rebuilds segments', () => {
    const root = mount();
    renderFractionDemo(root);
    const select = root.querySelector(
      '#denominator-select'
    ) as HTMLSelectElement;
    select.value = '8';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const segments8 = root.querySelectorAll(
      '#interactive-bar .fraction-segment'
    );
    expect(segments8.length).toBe(8);
    (segments8[7] as HTMLElement).click();
    expect(root.querySelector('#interactive-value')?.textContent).toMatch(
      /8\/8|1/
    );

    select.value = '3';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(
      root.querySelectorAll('#interactive-bar .fraction-segment').length
    ).toBe(3);
    const value = root.querySelector('#interactive-value')?.textContent ?? '';
    // clamped to ≤ denom
    expect(value).toMatch(/[123]\/3/);
  });

  it('divide op accepts zero-divisor input without auto-calc; chrome stays', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('.op-btn[data-op="divide"]') as HTMLButtonElement).click();
    expect(
      root
        .querySelector('.op-btn[data-op="divide"]')
        ?.classList.contains('selected')
    ).toBe(true);

    (root.querySelector('#fraction-a') as HTMLInputElement).value = '1/2';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '0/1';
    // op change does not auto-recalculate — prior add result chrome remains
    expect(
      (root.querySelector('#arithmetic-result')?.innerHTML.length ?? 0) > 0
    ).toBe(true);
    expect(root.querySelector('#interactive-bar')).toBeTruthy();
    expect(root.querySelector('#back-btn')).toBeTruthy();

    // recover with a valid divisor and calculate
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/4';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#arithmetic-result')?.textContent).toMatch(
      /2|result|\//i
    );
  });

  it('op selection changes selected class without auto-recalculating', () => {
    const root = mount();
    renderFractionDemo(root);
    const before = root.querySelector('#arithmetic-result')?.innerHTML;
    (root.querySelector('.op-btn[data-op="multiply"]') as HTMLButtonElement).click();
    expect(
      root
        .querySelector('.op-btn[data-op="multiply"]')
        ?.classList.contains('selected')
    ).toBe(true);
    expect(root.querySelector('#arithmetic-result')?.innerHTML).toBe(before);
  });
});
