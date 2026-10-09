/**
 * Wave 56 leftover after #256 — Polyomino Unique Orientations + cell(s) shape-info.
 * Distinct from wave55 Can Flip / wave51 pattern ID leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 demos — poly Unique Orientations', () => {
  it('shape-info includes Unique Orientations and N cell(s)', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const info = root.querySelector('#shape-info')?.textContent ?? '';
    expect(info).toMatch(/Unique Orientations/);
    expect(info).toMatch(/\d+\s+cell\(s\)/);
  });
});
