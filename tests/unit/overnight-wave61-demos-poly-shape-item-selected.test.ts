/**
 * Wave 61 leftover after #301 (unit-only) — Polyomino .shape-item.selected class toggle.
 * Distinct from wave60 set-btn selected leftover. Tests-only.
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

describe('Wave 61 demos — poly shape-item selected', () => {
  it('clicking first gallery shape adds .selected to that item', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery .shape-item') as HTMLElement).click();
    expect(
      root.querySelector('#shape-gallery .shape-item')?.classList.contains(
        'selected'
      )
    ).toBe(true);
    expect(
      root.querySelectorAll('#shape-gallery .shape-item.selected').length
    ).toBe(1);
  });
});
