/**
 * Wave 64 leftover after tip/#303 (unit-only) — frac denom 4 selected.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — frac denom 4 selected', () => {
  it('locks denominator-select idle value 4 + option catalog', () => {
    const root = mount();
    renderFractionDemo(root);
    const sel = root.querySelector(
      '#denominator-select'
    ) as HTMLSelectElement;
    expect(sel.value).toBe('4');
    expect(
      [...sel.options].map((o) => o.value)
    ).toEqual(['2', '3', '4', '5', '6', '8', '10', '12']);
    expect(root.querySelector('#interactive-value')?.textContent).toBe('1/4');
  });
});
