/**
 * Wave 61 leftover after #301 (unit-only) — Fraction compare input width + gallery decimal inject CSS leftovers.
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

describe('Wave 61 demos — frac compare/decimal CSS', () => {
  it('locks compare input 80px + gallery decimal gray', () => {
    const root = mount();
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('width: 80px');
    expect(css).toContain('.gallery-item .decimal {');
    expect(css).toContain('font-size: 0.75rem');
    expect(css).toContain('color: #888');
  });
});
