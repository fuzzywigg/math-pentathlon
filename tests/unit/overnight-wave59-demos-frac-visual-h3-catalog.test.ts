/**
 * Wave 59 leftover after #281 (unit-only) — Fraction visual h3 catalog.
 * Distinct from wave58 top-level h2 leftovers. Tests-only.
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

describe('Wave 59 demos — frac visual h3 catalog', () => {
  it('exposes Horizontal / Vertical / Circle h3s', () => {
    const root = mount();
    renderFractionDemo(root);
    const h3 = [...root.querySelectorAll('h3')].map((el) => el.textContent ?? '');
    expect(h3).toContain('Horizontal Bars');
    expect(h3).toContain('Vertical Bars');
    expect(h3).toContain('Circle (Pie) Charts');
  });
});
