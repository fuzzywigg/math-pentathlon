/**
 * Wave 61 leftover after #301 (unit-only) — Fraction interactive-value default 1/4.
 * Distinct from wave60 section paras leftover. Tests-only.
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

describe('Wave 61 demos — frac interactive-value default', () => {
  it('mounts exact 1/4 on #interactive-value', () => {
    const root = mount();
    renderFractionDemo(root);
    expect(root.querySelector('#interactive-value')?.textContent).toBe('1/4');
  });
});
