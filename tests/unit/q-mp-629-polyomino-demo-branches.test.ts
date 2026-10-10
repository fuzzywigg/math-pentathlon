/**
 * q-mp-629 — close polyomino-demo branch gaps (tests-only).
 * Structural asserts only: no player-facing copy / aria / label pins.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function selectSet(root: ParentNode, set: string): void {
  (
    root.querySelector(`.set-btn[data-set="${set}"]`) as HTMLButtonElement
  ).click();
}

function selectFirstShape(root: ParentNode): void {
  (root.querySelector('#shape-gallery .shape-item') as HTMLElement).click();
}

function boardCell(
  root: ParentNode,
  row: number,
  col: number
): SVGElement | null {
  return root.querySelector(
    `#board-container rect[data-row="${row}"][data-col="${col}"]`
  ) as SVGElement | null;
}

describe('q-mp-629 polyomino-demo — mount + back + shape sets', () => {
  it('renders anchors and exercises back-button navigate listener', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);

    expect(root.querySelector('#shape-gallery')).toBeTruthy();
    expect(root.querySelector('#board-container')).toBeTruthy();
    expect(root.querySelector('#valid-positions')).toBeTruthy();
    expect(root.querySelector('#rotation-controls')).toBeTruthy();
    expect(root.querySelectorAll('.set-btn').length).toBe(4);

    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    expect(backBtn).toBeTruthy();
    expect(backBtn.classList.contains('back-button')).toBe(true);
    expect(() => backBtn.click()).not.toThrow();
  });

  it('cycles every shape-set button including unknown data-set default', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);

    for (const set of ['pentominoes', 'simple', 'pattern', 'tetrominoes']) {
      selectSet(root, set);
      const selected = root.querySelector('.set-btn.selected') as HTMLElement;
      expect(selected?.dataset.set).toBe(set);
      expect(
        root.querySelectorAll('#shape-gallery .shape-item').length
      ).toBeGreaterThan(0);
    }

    // Force switch default: unknown set name leaves catalog unchanged
    const rogue = root.querySelector(
      '.set-btn[data-set="simple"]'
    ) as HTMLButtonElement;
    rogue.dataset.set = 'unknown-set';
    const countBefore = root.querySelectorAll(
      '#shape-gallery .shape-item'
    ).length;
    rogue.click();
    expect(root.querySelectorAll('#shape-gallery .shape-item').length).toBe(
      countBefore
    );
  });
});

describe('q-mp-629 polyomino-demo — rotate / flip / place / undo / clear', () => {
  it('CW + CCW rotate and flip refresh orientation + valid-positions chrome', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);
    // Pattern blocks include canFlip shapes (first tetromino I does not).
    selectSet(root, 'pattern');

    let flip: HTMLButtonElement | null = null;
    const items = [
      ...root.querySelectorAll('#shape-gallery .shape-item'),
    ] as HTMLElement[];
    for (const item of items) {
      item.click();
      flip = root.querySelector(
        '#rotation-controls button[title="Flip horizontally"]'
      );
      if (flip) {
        break;
      }
    }
    expect(flip).toBeTruthy();

    const cw = root.querySelector(
      '#rotation-controls button[title="Rotate clockwise"]'
    ) as HTMLButtonElement;
    const ccw = root.querySelector(
      '#rotation-controls button[title="Rotate counter-clockwise"]'
    ) as HTMLButtonElement;
    expect(cw && ccw).toBeTruthy();
    cw.click();
    ccw.click();
    flip!.click();

    expect(root.querySelector('#selected-shape svg')).toBeTruthy();
    expect(
      (root.querySelector('#valid-positions')?.children.length ?? 0) > 0
    ).toBe(true);
    expect(
      (root.querySelector('#orientation-count')?.textContent ?? '').length
    ).toBeGreaterThan(0);
    expect(
      root.querySelectorAll('#all-orientations .orientation-item').length
    ).toBeGreaterThan(0);
  });

  it('places on board, undoes, clears; mouseleave clears preview overlay', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);
    selectSet(root, 'simple');
    selectFirstShape(root);

    const cell = boardCell(root, 0, 0);
    expect(cell).toBeTruthy();
    cell!.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    expect(
      root.querySelector('#board-container .preview-overlay')
    ).toBeTruthy();

    // Re-enter paints again (existing-preview remove branch)
    cell!.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    expect(
      root.querySelector('#board-container .preview-overlay')
    ).toBeTruthy();

    cell!.dispatchEvent(new Event('click', { bubbles: true }));
    const emptyAfterPlace =
      root.querySelector('#empty-count')?.textContent ?? '';
    expect(emptyAfterPlace).not.toMatch(/Empty:\s*100\b/);

    const svg = root.querySelector('#board-container svg');
    expect(svg).toBeTruthy();
    svg!.dispatchEvent(new Event('mouseleave', { bubbles: true }));
    expect(root.querySelector('#board-container .preview-overlay')).toBeNull();

    (root.querySelector('#undo-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#empty-count')?.textContent).toMatch(
      /Empty:\s*100\b/
    );

    cell!.dispatchEvent(new Event('click', { bubbles: true }));
    (root.querySelector('#clear-board-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#empty-count')?.textContent).toMatch(
      /Empty:\s*100\b/
    );
  });

  it('board click without selection and dataset-stripped cells are no-ops', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);

    const emptyBefore = root.querySelector('#empty-count')?.textContent ?? '';
    const bare = boardCell(root, 1, 1);
    expect(bare).toBeTruthy();
    bare!.dispatchEvent(new Event('click', { bubbles: true }));
    bare!.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    expect(root.querySelector('#empty-count')?.textContent).toBe(emptyBefore);
    expect(root.querySelector('#board-container .preview-overlay')).toBeNull();

    selectSet(root, 'simple');
    selectFirstShape(root);
    const stripped = boardCell(root, 2, 2);
    expect(stripped).toBeTruthy();
    delete stripped!.dataset.row;
    delete stripped!.dataset.col;
    stripped!.dispatchEvent(new Event('click', { bubbles: true }));
    stripped!.dispatchEvent(new Event('mouseenter', { bubbles: true }));
    expect(root.querySelector('#empty-count')?.textContent).toMatch(
      /Empty:\s*100\b/
    );
  });

  it('invalid corner hover uses red preview; invalid click keeps empty count', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);
    selectSet(root, 'pentominoes');
    selectFirstShape(root);

    const emptyBefore = root.querySelector('#empty-count')?.textContent ?? '';
    const corner = boardCell(root, 9, 9);
    expect(corner).toBeTruthy();
    corner!.dispatchEvent(new Event('mouseenter', { bubbles: true }));

    const previewRect = root.querySelector(
      '#board-container .preview-overlay rect'
    );
    expect(previewRect?.getAttribute('fill')).toBe('#f44336');

    corner!.dispatchEvent(new Event('click', { bubbles: true }));
    expect(root.querySelector('#empty-count')?.textContent).toBe(emptyBefore);
  });
});

describe('q-mp-629 polyomino-demo — defensive early returns', () => {
  it('missing gallery / shape-info / selected-shape hosts return without throw', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);

    document.getElementById('shape-gallery')?.remove();
    expect(() => selectSet(root, 'simple')).not.toThrow();

    // Remount for remaining early-return hosts
    document.body.innerHTML = '';
    const root2 = mountRoot();
    renderPolyominoDemo(root2);
    document.getElementById('shape-info')?.remove();
    expect(() => selectFirstShape(root2)).not.toThrow();

    document.body.innerHTML = '';
    const root3 = mountRoot();
    renderPolyominoDemo(root3);
    document.getElementById('selected-shape')?.remove();
    expect(() => selectFirstShape(root3)).not.toThrow();
  });

  it('missing valid-positions host skips updateValidPositions body', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);
    document.getElementById('valid-positions')?.remove();
    expect(() => {
      selectSet(root, 'simple');
      selectFirstShape(root);
    }).not.toThrow();
    expect(document.getElementById('valid-positions')).toBeNull();
  });

  it('missing board-container aborts renderBoardSection wiring', () => {
    const orig = document.getElementById.bind(document);
    const spy = vi
      .spyOn(document, 'getElementById')
      .mockImplementation((id: string) => {
        if (id === 'board-container') {
          return null;
        }
        return orig(id);
      });

    const root = mountRoot();
    expect(() => renderPolyominoDemo(root)).not.toThrow();
    spy.mockRestore();
  });

  it('missing back-btn skips navigate wiring; missing empty-count skips count update', () => {
    const orig = document.getElementById.bind(document);
    const spy = vi
      .spyOn(document, 'getElementById')
      .mockImplementation((id: string) => {
        if (id === 'back-btn') {
          return null;
        }
        return orig(id);
      });

    const root = mountRoot();
    expect(() => renderPolyominoDemo(root)).not.toThrow();
    expect(document.getElementById('back-btn')).toBeNull();
    spy.mockRestore();

    document.body.innerHTML = '';
    const root2 = mountRoot();
    renderPolyominoDemo(root2);
    document.getElementById('empty-count')?.remove();
    selectSet(root2, 'simple');
    selectFirstShape(root2);
    const cell = boardCell(root2, 0, 0);
    expect(cell).toBeTruthy();
    expect(() =>
      cell!.dispatchEvent(new Event('click', { bubbles: true }))
    ).not.toThrow();
    expect(document.getElementById('empty-count')).toBeNull();
  });

  it('clearing selected shape restores placeholder chrome via set switch', () => {
    const root = mountRoot();
    renderPolyominoDemo(root);
    selectSet(root, 'simple');
    selectFirstShape(root);
    expect(root.querySelector('#selected-shape svg')).toBeTruthy();

    selectSet(root, 'tetrominoes');
    expect(root.querySelector('#selected-shape .placeholder')).toBeTruthy();
    expect((root.querySelector('#shape-info')?.children.length ?? 0) > 0).toBe(
      true
    );
  });
});
