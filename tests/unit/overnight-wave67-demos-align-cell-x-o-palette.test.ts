/**
 * Wave 67 leftover after tip/#324 (unit-only) — align cell-x-o palette.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — align cell-x / cell-o palette', () => {
  it('locks .cell-x #bbdefb + .cell-o #ffcdd2', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.cell-x { background: #bbdefb; color: #1565c0; }');
    expect(css).toContain('.cell-o { background: #ffcdd2; color: #c62828; }');
  });
});
