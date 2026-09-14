/**
 * Wave 57 leftover after #267 — Poly Current orientation valid-position copy.
 * Distinct from wave56 unique orientations leftover. Tests-only.
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

describe('Wave 57 demos — poly current orientation', () => {
  it('shape select paints Current orientation: N valid position(s)', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement).click();
    const first = root.querySelector('#shape-gallery > *') as HTMLElement;
    first.click();
    expect(root.querySelector('#valid-positions')?.textContent ?? '').toMatch(
      /Current orientation:\s*\d+ valid position\(s\)/
    );
  });
});
