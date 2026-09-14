/**
 * Wave 61 leftover after #301 (unit-only) — Fraction comparison vs chrome span.
 * Distinct from wave60 equals exact leftover. Tests-only.
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

describe('Wave 61 demos — frac compare vs span', () => {
  it('mounts exact vs span between compare inputs', () => {
    const root = mount();
    renderFractionDemo(root);
    expect(
      root.querySelector('.comparison-inputs > span')?.textContent
    ).toBe('vs');
  });
});
