/**
 * Wave 61 leftover after #301 (unit-only) — Polyomino shape-info h3 name exact.
 * Distinct from wave56 Unique Orientations soft leftover. Tests-only.
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

describe('Wave 61 demos — poly shape-info h3 name', () => {
  it('first tetromino paints exact I-tetromino h3', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery .shape-item') as HTMLElement).click();
    expect(root.querySelector('#shape-info h3')?.textContent).toBe(
      'I-tetromino'
    );
  });
});
