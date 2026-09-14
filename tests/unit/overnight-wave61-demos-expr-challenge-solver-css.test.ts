/**
 * Wave 61 leftover after #301 (unit-only) — Expression challenge-grid + solver-btn inject CSS leftovers.
 * Distinct from wave60 demos residual leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

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

describe('Wave 61 demos — expr challenge/solver CSS', () => {
  it('locks challenge minmax grid + solver green hover', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))');
    expect(css).toContain('background: #4caf50');
    expect(css).toContain('background: #388e3c');
    expect(css).toContain('width: 60px');
  });
});
