/**
 * Wave 59 leftover after #281 — Poly Clear Board + Any orientation after select.
 * Distinct from set-btn / Empty:100 leftover. Tests-only.
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

describe('Wave 59 demos — poly Clear Board + Any orientation', () => {
  it('exposes Clear Board; selected simple shape shows Any orientation Can be placed', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    expect(root.querySelector('#clear-board-btn')?.textContent?.trim()).toBe(
      'Clear Board'
    );
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();
    expect(root.querySelector('#valid-positions')?.textContent ?? '').toMatch(
      /Any orientation:\s*Can be placed/
    );
  });
});
