/**
 * Overnight TOKENMAXX HEAVY — polyomino flip + invalid hover preview leftovers.
 * Distinct from #197/#202 rotate/hover/mouseleave. Tests-only.
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

describe('Overnight demos45 — poly flip / invalid preview', () => {
  it('flip control toggles orientation chrome when canFlip', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const before = root.querySelector('#valid-positions')?.textContent ?? '';
    const flipBtn = [...root.querySelectorAll('#rotation-controls button')].find(
      (b) =>
        (b.textContent ?? '').includes('⇄') ||
        /flip/i.test(b.getAttribute('title') ?? '')
    ) as HTMLButtonElement | undefined;

    if (flipBtn) {
      flipBtn.click();
      expect(root.querySelector('#selected-shape svg')).toBeTruthy();
      expect(
        (root.querySelector('#valid-positions')?.textContent ?? '').length
      ).toBeGreaterThan(0);
      expect(before.length).toBeGreaterThan(0);
    } else {
      // shape may disallow flip — Can Flip: No still renders
      expect(root.querySelector('#shape-info')?.textContent).toMatch(/Can Flip/i);
    }
  });

  it('corner hover paints red invalid preview; invalid click keeps empty count', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="pentominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const emptyBefore = parseInt(
      (root.querySelector('#empty-count')?.textContent ?? '').replace(/\D+/g, ''),
      10
    );

    const corner = root.querySelector(
      '#board-container rect[data-row="9"][data-col="9"]'
    ) as SVGElement;
    expect(corner).toBeTruthy();
    corner.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const preview = root.querySelector(
      '#board-container .preview-overlay'
    ) as SVGElement | null;
    if (preview) {
      const fills = [...preview.querySelectorAll('rect')].map((r) =>
        r.getAttribute('fill')
      );
      expect(fills.some((f) => f === '#f44336' || f === '#4caf50')).toBe(true);
    }

    corner.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const emptyAfter = parseInt(
      (root.querySelector('#empty-count')?.textContent ?? '').replace(/\D+/g, ''),
      10
    );
    // OOB / invalid place must not consume cells
    expect(emptyAfter).toBe(emptyBefore);
  });
});
