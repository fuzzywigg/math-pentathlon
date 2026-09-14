/**
 * Wave 58 leftover after #267 — Polyomino set-btn label catalog.
 * Distinct from data-set click leftovers. Tests-only.
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

describe('Wave 58 demos — poly set-btn labels', () => {
  it('exacts Tetrominoes/Pentominoes/Simple/Pattern Blocks labels', () => {
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
  });
});
