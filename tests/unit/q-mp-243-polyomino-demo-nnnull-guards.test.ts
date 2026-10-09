/**
 * q-mp-243 — pin polyomino-demo board hover/click + orientation gallery
 * after clearing @typescript-eslint/no-non-null-assertion (narrow locals /
 * dataset guards). Behavior must match the pre-guard tip for real cells.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { TETROMINOES } from '../../src/core/polyomino/types';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('q-mp-243 polyomino-demo nnnull guards', () => {
  it('orientation gallery uses selected shape color without non-null asserts', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);

    const firstShape = root.querySelector('#shape-gallery > *') as HTMLElement;
    firstShape.click();

    const fill = root
      .querySelector('#all-orientations .orientation-item rect')
      ?.getAttribute('fill');
    expect(fill).toBe(TETROMINOES[0]?.color);
    expect(
      root.querySelectorAll('#all-orientations .orientation-item').length
    ).toBeGreaterThan(0);
  });

  it('board mouseenter draws a preview overlay; click places a cell', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderPolyominoDemo(root);

    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const cell = root.querySelector(
      '#board-container rect[data-row="0"][data-col="0"]'
    ) as SVGElement;
    expect(cell).toBeTruthy();

    cell.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    expect(
      root.querySelector('#board-container .preview-overlay')
    ).toBeTruthy();

    cell.dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#empty-count')?.textContent).not.toBe(
      'Empty: 100'
    );
  });
});
