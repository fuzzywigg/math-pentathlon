/**
 * Overnight TOKENMAXX HEAVY — polyomino multi-undo + module board bleed leftovers.
 * Distinct from #197 single undo. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function emptyCount(root: HTMLElement): number {
  return parseInt(
    (root.querySelector('#empty-count')?.textContent ?? '').replace(/\D+/g, ''),
    10
  );
}

function placeUntilDropped(root: HTMLElement, times: number): number {
  let placed = 0;
  for (let n = 0; n < times; n++) {
    const before = emptyCount(root);
    const cells = [
      ...root.querySelectorAll('#board-container rect[data-row]'),
    ] as SVGElement[];
    for (const cell of cells) {
      cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      if (emptyCount(root) < before) {
        placed++;
        break;
      }
    }
  }
  return placed;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight demos45 — poly undo stack / bleed', () => {
  it('three places then three undos restore full empty count', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const full = emptyCount(root);
    expect(full).toBe(100);
    const placed = placeUntilDropped(root, 3);
    expect(placed).toBeGreaterThanOrEqual(2);
    expect(emptyCount(root)).toBeLessThan(full);

    for (let i = 0; i < placed; i++) {
      (root.querySelector('#undo-btn') as HTMLButtonElement).click();
    }
    expect(emptyCount(root)).toBe(full);
  });

  it('remount without clear retains module board until Clear', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();
    placeUntilDropped(root, 1);
    const mid = emptyCount(root);
    expect(mid).toBeLessThan(100);

    root.innerHTML = '';
    renderPolyominoDemo(root);
    // module-level board may still show reduced empty count
    expect(emptyCount(root)).toBeLessThanOrEqual(mid + 0);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    expect(emptyCount(root)).toBe(100);
  });

  it('board click with no shape selected is a no-op', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    // deselect by re-clicking selected shape if possible, else switch set clears selection
    (
      root.querySelector('.set-btn[data-set="pattern"]') as HTMLButtonElement
    ).click();
    expect(root.querySelector('#selected-shape')?.textContent).toMatch(
      /Click a shape/i
    );
    const before = emptyCount(root);
    const cell = root.querySelector(
      '#board-container rect[data-row]'
    ) as SVGElement;
    cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(emptyCount(root)).toBe(before);
  });
});
