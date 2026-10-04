/**
 * Remounting the polyomino demo must reset module-level board state so
 * empty-count chrome matches a fresh 10×10 board (Empty: 100).
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

describe('polyomino demo remount', () => {
  it('resets Empty: 100 after a prior full board in the same realm', () => {
    const first = document.createElement('div');
    document.body.appendChild(first);
    renderPolyominoDemo(first);
    (
      first.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (first.querySelector('#shape-gallery > *') as HTMLElement).click();

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = first.querySelector(
          `#board-container rect[data-row="${row}"][data-col="${col}"]`
        ) as SVGElement;
        cell.dispatchEvent(new Event('click', { bubbles: true }));
      }
    }
    expect(first.querySelector('#empty-count')?.textContent).toBe('Empty: 0');

    document.body.innerHTML = '';
    const second = document.createElement('div');
    document.body.appendChild(second);
    renderPolyominoDemo(second);
    expect(second.querySelector('#empty-count')?.textContent).toBe(
      'Empty: 100'
    );
  });
});
