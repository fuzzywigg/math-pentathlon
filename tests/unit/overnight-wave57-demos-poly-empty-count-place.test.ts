/**
 * Overnight HEAVY leftover after #264 — empty-count decrements after place.
 * Distinct from wave56 shape-info flags. Tests-only.
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

describe('Wave 57 demos — poly empty count', () => {
  it('placing monomino from simple set yields Empty: 99', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    const shapes = [
      ...root.querySelectorAll('#shape-gallery > *'),
    ] as HTMLElement[];
    shapes[0].click();
    const cell = root.querySelector(
      '#board-container rect[data-row="0"][data-col="0"]'
    ) as SVGRectElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#empty-count')?.textContent).toBe('Empty: 99');
  });
});
