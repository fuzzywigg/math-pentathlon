/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Fraction demo h1/h2 titles.
 * Distinct from wave56 fraction arithmetic leftovers. Tests-only.
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

describe('Wave 58 demos — frac section titles', () => {
  it('exposes Fraction System Demo h1 and catalog h2s', () => {
    const root = mount();
    renderFractionDemo(root);
    expect(root.querySelector('h1')?.textContent).toBe('Fraction System Demo');
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Visual Fraction Bars');
    expect(h2).toContain('Fraction Arithmetic');
    expect(h2).toContain('Interactive Fraction Bar');
  });
});
