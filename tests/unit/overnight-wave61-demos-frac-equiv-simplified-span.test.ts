/**
 * Wave 61 leftover after #301 (unit-only) — Fraction equivalent Simplified span exact.
 * Distinct from soft /Simplified/i leftovers. Tests-only.
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

describe('Wave 61 demos — frac equiv Simplified span', () => {
  it('auto-find mounts exact Simplified span on first equivalent item', () => {
    const root = mount();
    renderFractionDemo(root);
    const span = root.querySelector(
      '.equivalent-item span'
    ) as HTMLElement | null;
    expect(span?.textContent).toBe('Simplified');
  });
});
