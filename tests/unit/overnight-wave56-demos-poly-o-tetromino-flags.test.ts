/**
 * Wave 56 leftover after #256 — O-tetromino Can Rotate/Flip both No.
 * Distinct from wave55 pentominoes and wave53 I canRotate false. Tests-only.
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

describe('Wave 56 demos — poly O-tetromino flags', () => {
  it('O shape reports Can Rotate No and Can Flip No', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    const shapes = [
      ...root.querySelectorAll('#shape-gallery > *'),
    ] as HTMLElement[];
    // Gallery order matches TETROMINOES: I, O, T, ...
    expect(shapes.length).toBeGreaterThanOrEqual(2);
    shapes[1].click();
    const info = root.querySelector('#shape-info')?.textContent ?? '';
    expect(info).toMatch(/O-tetromino|ID\s*O/i);
    expect(info).toMatch(/Can Rotate\s*No/);
    expect(info).toMatch(/Can Flip\s*No/);
  });
});
