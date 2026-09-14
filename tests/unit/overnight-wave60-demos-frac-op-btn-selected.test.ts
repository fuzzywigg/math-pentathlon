/**
 * Wave 60 leftover after #290 (unit-only) — Frac op-btn.selected default +.
 * Distinct from wave59 arithmetic labels leftover. Tests-only.
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

describe('Wave 60 demos — frac op-btn selected', () => {
  it('add op starts selected; multiply click swaps selected', () => {
    const root = mount();
    renderFractionDemo(root);
    const add = root.querySelector(
      '.op-btn[data-op="add"]'
    ) as HTMLButtonElement;
    const mul = root.querySelector(
      '.op-btn[data-op="multiply"]'
    ) as HTMLButtonElement;
    expect(add.classList.contains('selected')).toBe(true);
    mul.click();
    expect(mul.classList.contains('selected')).toBe(true);
    expect(add.classList.contains('selected')).toBe(false);
  });
});
