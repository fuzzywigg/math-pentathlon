/**
 * Wave 56 leftover after #256 — Polyomino Undo/Clear Board chrome mount.
 * Distinct from wave55 pentominoes Can Flip leftover. Tests-only.
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

describe('Wave 56 demos — poly undo/clear chrome', () => {
  it('mounts Clear Board and Undo controls with tetrominoes selected', () => {
    const root = mount();
    renderPolyominoDemo(root);
    expect(
      root.querySelector('.set-btn[data-set="tetrominoes"]')?.classList.contains(
        'selected'
      )
    ).toBe(true);
    expect(root.querySelector('#clear-board-btn')?.textContent).toMatch(
      /Clear Board/
    );
    expect(root.querySelector('#undo-btn')?.textContent).toMatch(/Undo/);
    expect(root.querySelector('#shape-gallery')).toBeTruthy();
    expect(root.querySelector('#board-container')).toBeTruthy();
  });
});
