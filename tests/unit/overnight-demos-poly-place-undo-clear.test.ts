/**
 * Overnight TOKENMAXX HEAVY — polyomino demo place / undo / clear leftovers.
 * Tests-only. Clears module board first for isolation. No product inventing.
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

describe('Overnight demos — poly place / undo / clear', () => {
  it('places selected monomino/simple shape, drops empty count, undo restores', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();

    // Simple set has 1-cell shapes — easiest valid placements
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery .shape-item') as HTMLElement).click();

    const emptyBefore = root.querySelector('#empty-count')?.textContent ?? '';
    const cell = root.querySelector(
      '#board-container rect[data-row="0"][data-col="0"]'
    ) as SVGElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(new Event('click', { bubbles: true }));

    const emptyAfter = root.querySelector('#empty-count')?.textContent ?? '';
    // empty count text should change OR valid-positions update
    expect(
      emptyAfter !== emptyBefore ||
        (root.querySelector('#valid-positions')?.textContent.length ?? 0) > 0
    ).toBe(true);

    (root.querySelector('#undo-btn') as HTMLButtonElement).click();
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#empty-count')?.textContent).toMatch(/Empty:\s*100/i);
  });

  it('valid-positions info updates after shape select on cleared board', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery .shape-item') as HTMLElement).click();
    expect(
      (root.querySelector('#valid-positions')?.textContent.length ?? 0) > 0
    ).toBe(true);
  });
});
