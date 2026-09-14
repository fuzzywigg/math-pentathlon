/**
 * Overnight demos leftover — polyomino set switch / place / undo / clear edges.
 * Existing renderPolyominoDemo APIs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const SHAPE_SETS = [
  'tetrominoes',
  'pentominoes',
  'simple',
  'pattern',
] as const;

describe('Overnight demos — polyomino place/undo', () => {
  it('exhausts shape-set catalog with exclusive selected + non-empty gallery', () => {
    const root = mount();
    renderPolyominoDemo(root);

    for (const name of SHAPE_SETS) {
      const btn = root.querySelector(
        `.set-btn[data-set="${name}"]`
      ) as HTMLButtonElement;
      btn.click();
      expect(btn.classList.contains('selected')).toBe(true);
      expect(root.querySelectorAll('.set-btn.selected')).toHaveLength(1);
      expect(
        (root.querySelector('#shape-gallery')?.children.length ?? 0) > 0
      ).toBe(true);
    }
  });

  it('shape select fills info, orientations, and valid-positions chrome', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const shape = root.querySelector(
      '#shape-gallery > *'
    ) as HTMLElement;
    expect(shape).toBeTruthy();
    shape.click();

    expect(root.querySelector('#selected-shape')?.textContent).not.toMatch(
      /Click a shape above/i
    );
    expect(
      (root.querySelector('#rotation-controls')?.children.length ?? 0) > 0
    ).toBe(true);
    expect(
      (root.querySelector('#orientation-count')?.textContent ?? '').length
    ).toBeGreaterThan(0);
    expect(root.querySelector('#shape-info')?.textContent).toMatch(
      /Size|Orientations|Color/i
    );
    expect(root.querySelector('#valid-positions')?.textContent).toMatch(
      /valid position/i
    );
  });

  it('place on board decreases empty count; undo restores; clear resets', () => {
    const root = mount();
    renderPolyominoDemo(root);

    // simple monomino/domino places more reliably
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    const shape = root.querySelector('#shape-gallery > *') as HTMLElement;
    shape.click();

    const emptyBefore = parseInt(
      (root.querySelector('#empty-count')?.textContent ?? '').replace(
        /\D+/g,
        ''
      ),
      10
    );
    expect(emptyBefore).toBeGreaterThan(0);

    const cells = root.querySelectorAll(
      '#board-container rect[data-row]'
    );
    expect(cells.length).toBeGreaterThan(0);

    let placed = false;
    for (const cell of Array.from(cells)) {
      (cell as SVGElement).dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      const emptyNow = parseInt(
        (root.querySelector('#empty-count')?.textContent ?? '').replace(
          /\D+/g,
          ''
        ),
        10
      );
      if (emptyNow < emptyBefore) {
        placed = true;
        break;
      }
    }
    expect(placed).toBe(true);

    const mid = parseInt(
      (root.querySelector('#empty-count')?.textContent ?? '').replace(
        /\D+/g,
        ''
      ),
      10
    );
    (root.querySelector('#undo-btn') as HTMLButtonElement).click();
    const afterUndo = parseInt(
      (root.querySelector('#empty-count')?.textContent ?? '').replace(
        /\D+/g,
        ''
      ),
      10
    );
    expect(afterUndo).toBeGreaterThanOrEqual(mid);

    // place again then clear
    const cells2 = root.querySelectorAll(
      '#board-container rect[data-row]'
    );
    for (const cell of Array.from(cells2)) {
      (cell as SVGElement).dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
      const emptyNow = parseInt(
        (root.querySelector('#empty-count')?.textContent ?? '').replace(
          /\D+/g,
          ''
        ),
        10
      );
      if (emptyNow < emptyBefore) break;
    }
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    const afterClear = parseInt(
      (root.querySelector('#empty-count')?.textContent ?? '').replace(
        /\D+/g,
        ''
      ),
      10
    );
    expect(afterClear).toBe(emptyBefore);
  });

  it('hover preview overlay appears when shape selected', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (
      root.querySelector('.set-btn[data-set="simple"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();

    const cell = root.querySelector(
      '#board-container rect[data-row]'
    ) as SVGElement;
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(root.querySelector('#board-container .preview-overlay')).toBeTruthy();

    const svg = root.querySelector('#board-container svg') as SVGElement;
    svg.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(root.querySelector('#board-container .preview-overlay')).toBeNull();
  });

  it('undo/clear without placement are no-ops on empty count', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const before = root.querySelector('#empty-count')?.textContent;
    (root.querySelector('#undo-btn') as HTMLButtonElement).click();
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#empty-count')?.textContent).toBe(before);
  });

  it('switching sets clears selected-shape prompt until reselect', () => {
    const root = mount();
    renderPolyominoDemo(root);
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();
    expect(root.querySelector('#selected-shape')?.textContent).not.toMatch(
      /Click a shape above/i
    );

    (
      root.querySelector('.set-btn[data-set="pentominoes"]') as HTMLButtonElement
    ).click();
    // gallery refreshed; click first of new set
    (root.querySelector('#shape-gallery > *') as HTMLElement).click();
    expect(
      (root.querySelector('#shape-info')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });
});
