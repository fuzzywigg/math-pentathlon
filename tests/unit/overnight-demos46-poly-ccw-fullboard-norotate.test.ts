/**
 * Overnight TOKENMAXX HEAVY — polyomino CCW / green preview / full-board / no-rotate leftovers.
 * Distinct from #220 flip+invalid red preview. Tests-only.
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

describe('Overnight demos46 — poly CCW / fullboard / norotate', () => {
  it('CCW rotate control keeps preview chrome on a flippable/rotatable shape', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="tetrominoes"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const ccw = root.querySelector(
      '#rotation-controls button[title="Rotate counter-clockwise"]'
    ) as HTMLButtonElement | null;
    expect(ccw).toBeTruthy();
    ccw!.click();
    expect(root.querySelector('#selected-shape svg')).toBeTruthy();
    expect(root.querySelector('#valid-positions')?.textContent ?? '').toMatch(
      /valid position|Can be placed|Cannot be placed/i
    );
  });

  it('monomino corner hover paints green valid preview fill', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const cell = root.querySelector(
      '#board-container rect[data-row="0"][data-col="0"]'
    ) as SVGElement;
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const preview = root.querySelector(
      '#board-container .preview-overlay'
    ) as SVGElement | null;
    expect(preview).toBeTruthy();
    const fills = [...preview!.querySelectorAll('rect')].map((r) =>
      r.getAttribute('fill')
    );
    expect(fills.some((f) => f === '#4caf50')).toBe(true);
  });

  it('filling board with monominoes yields Cannot be placed', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = root.querySelector(
          `#board-container rect[data-row="${row}"][data-col="${col}"]`
        ) as SVGElement;
        cell.dispatchEvent(new Event('click', { bubbles: true }));
      }
    }

    expect(root.querySelector('#empty-count')?.textContent).toMatch(
      /Empty:\s*0/i
    );
    expect(root.querySelector('#valid-positions')?.textContent).toMatch(
      /Cannot be placed/i
    );
  });

  it('Single monomino reports Can Rotate: No and Can Flip: No', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();
    const info = root.querySelector('#shape-info')?.textContent ?? '';
    // dt/dd textContent has no colon between label and value
    expect(info).toMatch(/Can Rotate\s+No/i);
    expect(info).toMatch(/Can Flip\s+No/i);
    expect(
      root.querySelector(
        '#rotation-controls button[title="Flip horizontal"]'
      )
    ).toBeFalsy();
  });
});
