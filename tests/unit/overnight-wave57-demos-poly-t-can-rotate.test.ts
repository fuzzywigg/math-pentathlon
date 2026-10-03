/**
 * Overnight HEAVY leftover after #264 — T-tetromino Can Rotate Yes.
 * Distinct from wave56 O Can Rotate No. Tests-only.
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

describe('Wave 57 demos — poly T can rotate', () => {
  it('T shape reports Can Rotate Yes', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    const shapes = [
      ...root.querySelectorAll('#shape-gallery > *'),
    ] as HTMLElement[];
    // I, O, T → index 2
    shapes[2].click();
    const info = root.querySelector('#shape-info')?.textContent ?? '';
    expect(info).toMatch(/T-tetromino|ID\s*T/i);
    expect(info).toMatch(/Can Rotate\s*Yes/);
  });
});
