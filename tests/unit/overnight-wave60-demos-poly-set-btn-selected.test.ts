/**
 * Wave 60 leftover after #290 (unit-only) — Poly set-btn.selected class toggle.
 * Distinct from wave59 h1 shape-set catalog leftover. Tests-only.
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

describe('Wave 60 demos — poly set-btn selected', () => {
  it('Simple set click gains .selected; Tetrominoes loses it', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const tetra = root.querySelector(
      '.set-btn[data-set="tetrominoes"]'
    ) as HTMLButtonElement;
    const simple = root.querySelector(
      '.set-btn[data-set="simple"]'
    ) as HTMLButtonElement;
    expect(tetra.classList.contains('selected')).toBe(true);
    simple.click();
    expect(simple.classList.contains('selected')).toBe(true);
    expect(tetra.classList.contains('selected')).toBe(false);
  });
});
