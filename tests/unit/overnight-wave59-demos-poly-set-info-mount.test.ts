/**
 * Wave 59 leftover after #281 — Poly set-btn labels + idle info + Empty:100 mount.
 * Distinct from wave58 Current orientation leftover. Tests-only.
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

describe('Wave 59 demos — poly set/info mount', () => {
  it('locks set-btn labels, shape-info placeholder, Empty: 100, Undo', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);
    expect(
      root.querySelector('.set-btn[data-set="tetrominoes"]')?.textContent?.trim()
    ).toBe('Tetrominoes (4)');
    expect(
      root.querySelector('.set-btn[data-set="pentominoes"]')?.textContent?.trim()
    ).toBe('Pentominoes (5)');
    expect(
      root.querySelector('.set-btn[data-set="simple"]')?.textContent?.trim()
    ).toBe('Simple (1-3)');
    expect(
      root.querySelector('.set-btn[data-set="pattern"]')?.textContent?.trim()
    ).toBe('Pattern Blocks');
    expect(root.querySelector('#shape-info')?.textContent?.trim()).toBe(
      'Select a shape to see details'
    );
    expect(root.querySelector('#selected-shape .placeholder')?.textContent?.trim()).toBe(
      'Click a shape above to select'
    );
    expect(root.querySelector('#empty-count')?.textContent).toBe('Empty: 100');
    expect(root.querySelector('#undo-btn')?.textContent?.trim()).toBe('Undo');
  });
});
