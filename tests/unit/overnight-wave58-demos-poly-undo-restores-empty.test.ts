/**
 * Overnight HEAVY leftover after #274 — undo after place restores Empty: 100.
 * Distinct from wave57 empty-count place → 99. Tests-only.
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

describe('Wave 58 demos — poly undo restores empty', () => {
  it('undo after monomino place restores Empty: 100', () => {
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
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#empty-count')?.textContent).toMatch(
      /Empty:\s*99/
    );
    (root.querySelector('#undo-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#empty-count')?.textContent).toMatch(
      /Empty:\s*100/
    );
  });
});
