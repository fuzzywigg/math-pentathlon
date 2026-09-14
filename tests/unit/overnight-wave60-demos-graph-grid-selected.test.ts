/**
 * Wave 60 leftover after #290 (unit-only) — Graph default grid template selected.
 * Distinct from wave59 template btn catalog leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

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

describe('Wave 60 demos — graph grid selected class', () => {
  it('4x4 Grid starts selected; Circular click swaps selected', () => {
    const root = mount();
    renderGraphDemo(root);
    const grid = root.querySelector(
      '.template-btn[data-template="grid"]'
    ) as HTMLButtonElement;
    const circular = root.querySelector(
      '.template-btn[data-template="circular"]'
    ) as HTMLButtonElement;
    expect(grid.classList.contains('selected')).toBe(true);
    circular.click();
    expect(circular.classList.contains('selected')).toBe(true);
    expect(grid.classList.contains('selected')).toBe(false);
  });
});
