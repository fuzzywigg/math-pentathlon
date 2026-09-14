/**
 * Wave 59 leftover after #281 (unit-only) — Polyomino Clear Board / Empty / select copy.
 * Distinct from wave57 Empty: 99 after-place leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

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

describe('Wave 59 demos — poly clear empty select', () => {
  it('exposes Clear Board, Empty: 100, Select a shape to see details', () => {
    const root = mount();
    renderPolyominoDemo(root);
    expect(root.querySelector('#clear-board-btn')?.textContent).toBe('Clear Board');
    expect(root.querySelector('#empty-count')?.textContent).toBe('Empty: 100');
    expect(root.querySelector('#shape-info')?.textContent?.trim()).toBe(
      'Select a shape to see details'
    );
  });
});
