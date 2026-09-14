/**
 * Wave 61 leftover after #301 (unit-only) — Alignment cell-x / cell-o inject CSS leftovers.
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

describe('Wave 61 demos — align cell-x/o CSS', () => {
  it('locks .cell-x / .cell-o board piece colors', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.cell-x { background: #bbdefb; color: #1565c0; }');
    expect(css).toContain('.cell-o { background: #ffcdd2; color: #c62828; }');
    expect(css).toContain('.cell-blue { background: #1976d2; }');
    expect(css).toContain('.cell-red { background: #d32f2f; }');
  });
});
