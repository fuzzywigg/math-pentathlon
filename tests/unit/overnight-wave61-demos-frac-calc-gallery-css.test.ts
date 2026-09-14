/**
 * Wave 61 leftover after #301 (unit-only) — Fraction calculate-btn hover + gallery grid inject CSS leftovers.
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

describe('Wave 61 demos — frac calc/gallery CSS', () => {
  it('locks calculate hover green + gallery minmax grid', () => {
    const root = mount();
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.calculate-btn:hover {');
    expect(css).toContain('background: #45a049');
    expect(css).toContain('grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))');
  });
});
