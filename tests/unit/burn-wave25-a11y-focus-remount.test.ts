/**
 * Wave 25 — board-a11y focus remount matrix across rebuild patterns.
 * Distinct from #131 inventory ledgers and #133 router/shell.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  makeGridCell,
  markBoardAsGrid,
  collectGridCells,
  applyRovingTabindex,
  captureFocusedCell,
  restoreFocusedCell,
  restoreGridFocus,
  bindGridNavigation,
  buildCellAriaLabel,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function cell(
  row: number,
  col: number,
  extras?: { empty?: boolean; owner?: string; valid?: boolean }
): HTMLElement {
  const el = document.createElement('div');
  el.dataset.row = String(row);
  el.dataset.col = String(col);
  makeGridCell(
    el,
    buildCellAriaLabel({
      coord: `${row},${col}`,
      empty: extras?.empty ?? !extras?.owner,
      owner: extras?.owner,
      validPlacement: extras?.valid,
    })
  );
  return el;
}

function mountBoard(
  container: HTMLElement,
  coords: Array<[number, number]>,
  focus?: { row: string; col: string } | null
): void {
  container.innerHTML = '';
  const board = document.createElement('div');
  markBoardAsGrid(board);
  for (const [r, c] of coords) {
    board.appendChild(cell(r, c));
  }
  container.appendChild(board);
  restoreGridFocus(container, focus ?? null);
}

describe('Wave 25 a11y-focus-remount — capture → rebuild → restore', () => {
  it('full cycle on 3×3 keeps focus at last arrow position', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const coords: Array<[number, number]> = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) coords.push([r, c]);
    }
    mountBoard(container, coords);
    bindGridNavigation(container.querySelector('[role="grid"]')!);
    const first = collectGridCells(container)[0] as HTMLElement;
    first.focus();
    // 0,0 → right → 0,1
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    const mid = document.activeElement as HTMLElement;
    expect(mid.getAttribute('data-row')).toBe('0');
    expect(mid.getAttribute('data-col')).toBe('1');
    // 0,1 → down → 1,1
    mid.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    const focus = captureFocusedCell(container);
    expect(focus).toEqual({ row: '1', col: '1' });

    mountBoard(container, coords, focus);
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-row')
    ).toBe('1');
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-col')
    ).toBe('1');
  });

  it('shrinking board: missing focus falls back to first + focuses', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountBoard(container, [
      [0, 0],
      [0, 1],
      [5, 5],
    ]);
    const far = container.querySelector(
      '[data-row="5"][data-col="5"]'
    ) as HTMLElement;
    far.focus();
    const focus = captureFocusedCell(container);
    mountBoard(
      container,
      [
        [0, 0],
        [0, 1],
      ],
      focus
    );
    // preferred missing → first cell, and focus truthy → focuses first
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-row')
    ).toBe('0');
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-col')
    ).toBe('0');
  });

  it('expanding board: prior focus still found among new cells', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountBoard(container, [
      [1, 1],
      [1, 2],
    ]);
    const t = container.querySelector(
      '[data-row="1"][data-col="2"]'
    ) as HTMLElement;
    applyRovingTabindex(collectGridCells(container), {
      row: '1',
      col: '2',
    });
    t.focus();
    const focus = captureFocusedCell(container);
    mountBoard(
      container,
      [
        [0, 0],
        [1, 1],
        [1, 2],
        [2, 2],
        [3, 3],
      ],
      focus
    );
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-col')
    ).toBe('2');
  });

  it('restoreFocusedCell alone does not fix tabindex roving', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const a = cell(0, 0);
    const b = cell(0, 1);
    a.tabIndex = 0;
    b.tabIndex = 0; // both 0 — bad until restoreGridFocus
    container.append(a, b);
    a.focus();
    const focus = captureFocusedCell(container);
    container.innerHTML = '';
    const a2 = cell(0, 0);
    const b2 = cell(0, 1);
    a2.setAttribute('tabindex', '0');
    b2.setAttribute('tabindex', '0');
    container.append(a2, b2);
    restoreFocusedCell(container, focus);
    expect(document.activeElement).toBe(a2);
    // still both 0 — demonstrates why restoreGridFocus exists
    expect(a2.getAttribute('tabindex')).toBe('0');
    expect(b2.getAttribute('tabindex')).toBe('0');

    restoreGridFocus(container, focus);
    expect(a2.getAttribute('tabindex')).toBe('0');
    expect(b2.getAttribute('tabindex')).toBe('-1');
  });
});

describe('Wave 25 a11y-focus-remount — label refresh across remounts', () => {
  it('rebuild with new owners updates aria-label while keeping focus', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = '';
    const board = document.createElement('div');
    markBoardAsGrid(board);
    board.append(
      cell(0, 0, { empty: true }),
      cell(0, 1, { empty: true }),
      cell(1, 0, { empty: true })
    );
    container.appendChild(board);
    restoreGridFocus(container, { row: '0', col: '1' });
    expect(
      (document.activeElement as HTMLElement).getAttribute('aria-label')
    ).toContain('empty');

    container.innerHTML = '';
    const board2 = document.createElement('div');
    markBoardAsGrid(board2);
    board2.append(
      cell(0, 0, { owner: 'Blue' }),
      cell(0, 1, { owner: 'Red' }),
      cell(1, 0, { empty: true, valid: true })
    );
    container.appendChild(board2);
    restoreGridFocus(container, { row: '0', col: '1' });
    const active = document.activeElement as HTMLElement;
    expect(active.getAttribute('data-col')).toBe('1');
    expect(active.getAttribute('aria-label')).toBe('0,1, Red');
  });

  it('valid placement labels appear after midstate remount', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    mountBoard(container, [
      [0, 0],
      [0, 1],
    ]);
    container.innerHTML = '';
    const board = document.createElement('div');
    markBoardAsGrid(board);
    board.append(
      cell(0, 0, { empty: true, valid: true }),
      cell(0, 1, { empty: true })
    );
    container.appendChild(board);
    restoreGridFocus(container, { row: '0', col: '0' });
    expect(
      (document.activeElement as HTMLElement).getAttribute('aria-label')
    ).toContain('valid placement');
  });
});

describe('Wave 25 a11y-focus-remount — null focus policy', () => {
  it('null focus after first paint leaves tab stop without stealing', () => {
    const btn = document.createElement('button');
    btn.id = 'outside';
    document.body.appendChild(btn);
    btn.focus();

    const container = document.createElement('div');
    document.body.appendChild(container);
    mountBoard(
      container,
      [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      null
    );
    expect(document.activeElement).toBe(btn);
    const zeros = collectGridCells(container).filter(
      (c) => c.getAttribute('tabindex') === '0'
    );
    expect(zeros).toHaveLength(1);
  });

  it('alternating null and real focus across remounts', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const coords: Array<[number, number]> = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    mountBoard(container, coords, null);
    mountBoard(container, coords, { row: '1', col: '1' });
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-row')
    ).toBe('1');
    mountBoard(container, coords, null);
    // should not move focus to a cell if something else is focused —
    // after prior focus, active may still be old detached node; remount null
    // does not call focus — activeElement may be body
    const zeros = collectGridCells(container).filter(
      (c) => c.getAttribute('tabindex') === '0'
    );
    expect(zeros).toHaveLength(1);
  });
});

describe('Wave 25 a11y-focus-remount — rapid multi-step rebuilds', () => {
  it('10 rebuilds with walking focus coords stay coherent', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const coords: Array<[number, number]> = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) coords.push([r, c]);
    }

    let focus = { row: '0', col: '0' };
    for (let i = 0; i < 10; i++) {
      mountBoard(container, coords, focus);
      const cells = collectGridCells(container);
      expect(
        cells.filter((c) => c.getAttribute('tabindex') === '0')
      ).toHaveLength(1);
      const r = i % 4;
      const c = (i * 3) % 4;
      focus = { row: String(r), col: String(c) };
    }
    mountBoard(container, coords, focus);
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-row')
    ).toBe(focus.row);
    expect(
      (document.activeElement as HTMLElement).getAttribute('data-col')
    ).toBe(focus.col);
  });
});
