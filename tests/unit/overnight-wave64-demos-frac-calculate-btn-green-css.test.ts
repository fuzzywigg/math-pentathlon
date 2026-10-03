/**
 * Wave 64 leftover after tip/#303 (unit-only) — frac calculate btn green css.
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

describe('Wave 64 demos — frac calculate-btn green CSS', () => {
  it('locks .calculate-btn #4caf50 background', () => {
    const root = mount();
    renderFractionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.calculate-btn\s*\{[^}]*background:\s*#4caf50/);
  });
});
