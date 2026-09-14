/**
 * Wave 59 leftover after #281 (unit-only) — Fraction Compare/Find Equivalents buttons.
 * Distinct from wave56 visual-4dp leftovers. Tests-only.
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

describe('Wave 59 demos — frac compare/equiv buttons', () => {
  it('exposes exact Compare and Find Equivalents labels', () => {
    const root = mount();
    renderFractionDemo(root);
    expect(root.querySelector('#compare-btn')?.textContent).toBe('Compare');
    expect(root.querySelector('#find-equiv-btn')?.textContent).toBe(
      'Find Equivalents'
    );
  });
});
