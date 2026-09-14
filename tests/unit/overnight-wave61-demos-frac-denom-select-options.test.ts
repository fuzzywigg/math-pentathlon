/**
 * Wave 61 leftover after #301 (unit-only) — Fraction denominator select catalog + default 4.
 * Distinct from interactive-value default leftover. Tests-only.
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

describe('Wave 61 demos — frac denom select options', () => {
  it('locks 8 denom options with value 4 selected', () => {
    const root = mount();
    renderFractionDemo(root);
    const select = root.querySelector(
      '#denominator-select'
    ) as HTMLSelectElement;
    expect(select.options.length).toBe(8);
    expect([...select.options].map((o) => o.value)).toEqual([
      '2',
      '3',
      '4',
      '5',
      '6',
      '8',
      '10',
      '12',
    ]);
    expect(select.value).toBe('4');
  });
});
