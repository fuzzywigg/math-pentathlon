/**
 * Wave 64 leftover after tip/#303 (unit-only) — frac op btn 40px.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — frac op-btn 40×40', () => {
  it('locks .op-btn width/height 40px', () => {
    const root = mount();
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.op-btn\s*\{[^}]*width:\s*40px/);
    expect(css).toMatch(/\.op-btn\s*\{[^}]*height:\s*40px/);
  });
});
