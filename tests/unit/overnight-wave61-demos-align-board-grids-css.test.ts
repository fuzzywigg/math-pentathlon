/**
 * Wave 61 leftover after #301 (unit-only) — Alignment four/potential board grid inject CSS leftovers.
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

describe('Wave 61 demos — align board grids CSS', () => {
  it('locks four-board 7-col and potential 5-col grids', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('grid-template-columns: repeat(7, 50px)');
    expect(css).toContain('grid-template-columns: repeat(5, 50px)');
    expect(css).toContain('width: 50px');
    expect(css).toContain('height: 50px');
  });
});
