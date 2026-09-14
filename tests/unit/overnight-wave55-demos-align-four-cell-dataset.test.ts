/**
 * Wave 55 leftover after #250 — Alignment four-board cell data-row/data-col.
 * Shared board-ui dataset pattern across demos; not contig #243 cells. Tests-only.
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

describe('Wave 55 demos — align four cell dataset', () => {
  it('mounts a 6×7 four-board with corner data-row/data-col', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const cells = root.querySelectorAll('#four-board .demo-cell');
    expect(cells.length).toBe(42);
    expect(root.querySelector('#four-board .demo-cell[data-row="0"][data-col="0"]')).toBeTruthy();
    expect(root.querySelector('#four-board .demo-cell[data-row="5"][data-col="6"]')).toBeTruthy();
  });
});
