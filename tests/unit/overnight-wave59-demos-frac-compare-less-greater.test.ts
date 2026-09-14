/**
 * Wave 59 leftover after #281 (unit-only) — Fraction comparison less/greater exact copy.
 * Distinct from equals coverage outside wave56–58. Tests-only.
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

describe('Wave 59 demos — frac compare less/greater', () => {
  it('default 2/3 vs 3/4 paints exact is less than copy', () => {
    const root = mount();
    renderFractionDemo(root);
    // initCompareSection auto-clicks Compare on mount with defaults 2/3 vs 3/4
    expect(root.querySelector('.comparison-text')?.textContent).toBe(
      '2/3 is less than 3/4'
    );
  });

  it('swapped inputs paint exact is greater than copy', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#compare-a') as HTMLInputElement).value = '3/4';
    (root.querySelector('#compare-b') as HTMLInputElement).value = '2/3';
    (root.querySelector('#compare-btn') as HTMLButtonElement).click();
    expect(root.querySelector('.comparison-text')?.textContent).toBe(
      '3/4 is greater than 2/3'
    );
  });
});
