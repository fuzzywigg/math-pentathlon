/**
 * Wave 58 leftover after #267 — Poly Current orientation / Any orientation copy.
 * Distinct from wave57 empty-count place leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — poly current orientation', () => {
  it('selected simple shape shows Current orientation + Any orientation', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();
    const text = root.querySelector('#valid-positions')?.textContent ?? '';
    expect(text).toMatch(/Current orientation:\s*\d+ valid position\(s\)/);
    expect(text).toMatch(/Any orientation:\s*Can be placed/);
  });
});
