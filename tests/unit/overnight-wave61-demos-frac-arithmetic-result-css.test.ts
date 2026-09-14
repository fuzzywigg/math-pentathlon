/**
 * Wave 61 leftover after #301 (unit-only) — Fraction arithmetic-result steps/final inject CSS leftovers.
 * Distinct from wave60 demos residual leftovers. Tests-only.
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

describe('Wave 61 demos — frac arithmetic-result CSS', () => {
  it('locks steps monospace + final-result blue chrome', () => {
    const root = mount();
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.arithmetic-result .steps {');
    expect(css).toContain('font-family: monospace');
    expect(css).toContain('color: #555');
    expect(css).toContain('.arithmetic-result .final-result {');
    expect(css).toContain('color: #2196f3');
  });
});
