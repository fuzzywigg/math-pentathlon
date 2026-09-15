/**
 * Wave 67 leftover after tip/#324 (unit-only) — frac calc hover 45a049.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — frac calculate-btn hover #45a049', () => {
  it('locks .calculate-btn:hover background #45a049', () => {
    const root = mount();
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('background: #45a049');
  });
});
