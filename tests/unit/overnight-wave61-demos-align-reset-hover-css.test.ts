/**
 * Wave 61 leftover after #301 (unit-only) — Alignment reset-btn hover inject CSS leftover.
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

describe('Wave 61 demos — align reset hover CSS', () => {
  it('locks reset-btn fill + hover darken', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.demo-reset-btn {');
    expect(css).toContain('background: #1976d2');
    expect(css).toContain('.demo-reset-btn:hover {');
    expect(css).toContain('background: #1565c0');
  });
});
