/**
 * Wave 59 leftover after #281 (unit-only) — Fraction lower-section h2 titles.
 * Distinct from wave58 Visual/Arithmetic/Interactive h2 leftovers. Tests-only.
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

describe('Wave 59 demos — frac lower section titles', () => {
  it('exposes Comparison / Equivalent / Gallery h2s', () => {
    const root = mount();
    renderFractionDemo(root);
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Fraction Comparison');
    expect(h2).toContain('Equivalent Fractions');
    expect(h2).toContain('Common Fractions Gallery');
  });
});
