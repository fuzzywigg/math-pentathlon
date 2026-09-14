/**
 * Wave 61 leftover after #301 (unit-only) — Alignment hex-board gradient inject CSS leftover.
 * Distinct from wave60 demos residual leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

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

describe('Wave 61 demos — align hex gradient CSS', () => {
  it('locks hex-board blue-to-red edge gradient', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('background: linear-gradient(135deg, #1976d2 0%, #1976d2 10%, transparent 10%, transparent 90%, #d32f2f 90%)');
    expect(css).toContain('gap: 2px');
  });
});
