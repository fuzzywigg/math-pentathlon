/**
 * Overnight HEAVY leftover after #274 — pattern set Hexagon Can Rotate/Flip No.
 * Distinct from wave56 O-tetromino flags / wave57 T can-rotate. Tests-only.
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

describe('Wave 58 demos — poly pattern hexagon flags', () => {
  it('selecting Hexagon in pattern set shows Can Rotate/Flip No', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="pattern"]') as HTMLButtonElement
    ).click();
    const shapes = [
      ...root.querySelectorAll('#shape-gallery > *'),
    ] as HTMLElement[];
    // Hexagon is first in HEX_PATTERN_BLOCKS
    shapes[0].click();
    const info = root.querySelector('#shape-info')?.textContent ?? '';
    expect(info).toMatch(/Hexagon/i);
    expect(info).toMatch(/Can Rotate\s*No/i);
    expect(info).toMatch(/Can Flip\s*No/i);
  });
});
