/**
 * Wave 56 leftover after #256 — Fraction opening add op selected chrome.
 * Distinct from wave55 subtract-selected leftover. Tests-only.
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

describe('Wave 56 demos — frac opening add selected', () => {
  it('add is selected on mount; multiply/divide/subtract are not', () => {
    const root = mount();
    renderFractionDemo(root);
    expect(
      root.querySelector('.op-btn[data-op="add"]')?.classList.contains('selected')
    ).toBe(true);
    expect(
      root
        .querySelector('.op-btn[data-op="subtract"]')
        ?.classList.contains('selected')
    ).toBe(false);
    expect(
      root
        .querySelector('.op-btn[data-op="multiply"]')
        ?.classList.contains('selected')
    ).toBe(false);
    expect(
      root.querySelector('.op-btn[data-op="divide"]')?.classList.contains('selected')
    ).toBe(false);
    expect(root.querySelector('.op-btn[data-op="add"]')?.textContent).toBe('+');
  });
});
