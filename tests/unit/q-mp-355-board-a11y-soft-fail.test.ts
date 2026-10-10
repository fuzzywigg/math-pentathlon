/**
 * q-mp-355 — Characterize board-a11y soft-fail residuals (tests-only).
 *
 * Pins focus / keyboard / empty-board / deep-rowgroup edges with structural
 * asserts only. No player-facing copy pins. No src edits.
 *
 * Narrowed vs open drafts:
 * - #832 / q-mp-325 — mutation scores on the same host (orthogonal)
 * - #813 owl UI cov / #822 no-shadow controllers — disjoint
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyRovingTabindex,
  bindGridNavigation,
  captureFocusedCell,
  collectGridCells,
  ensureAriaGridRows,
  findGridNeighbor,
  labelBoardFromGameTitle,
  makeGridCell,
  markBoardAsGrid,
  restoreFocusedCell,
  restoreGridFocus,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function makeCell(row: number, col: number): HTMLElement {
  const cell = document.createElement('div');
  cell.dataset.row = String(row);
  cell.dataset.col = String(col);
  makeGridCell(cell, `${row},${col}`);
  return cell;
}

describe('q-mp-355 board-a11y — empty-board soft paths', () => {
  it('restoreGridFocus on empty container leaves no tabbable gridcell', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();

    restoreGridFocus(container, { row: '0', col: '0' });
    expect(collectGridCells(container)).toHaveLength(0);
    expect(document.activeElement).toBe(outside);
  });

  it('ensureAriaGridRows on empty grid is a no-op (no rows inserted)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    document.body.appendChild(board);
    ensureAriaGridRows(board);
    expect(board.querySelectorAll('[role="row"]')).toHaveLength(0);
    expect(board.querySelectorAll('[role="gridcell"]')).toHaveLength(0);
    expect(board.getAttribute('role')).toBe('grid');
  });

  it('findGridNeighbor / applyRovingTabindex stay null on empty cell lists', () => {
    expect(findGridNeighbor([], 0, 0, 1, 0)).toBeNull();
    expect(applyRovingTabindex([])).toBeNull();
    expect(applyRovingTabindex([], { row: '0', col: '0' })).toBeNull();
  });

  it('restoreFocusedCell soft-no-ops when coords missing after rebuild', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const keep = makeCell(0, 0);
    keep.tabIndex = 0;
    container.appendChild(keep);
    keep.focus();

    restoreFocusedCell(container, { row: '9', col: '9' });
    expect(document.activeElement).toBe(keep);
  });
});

describe('q-mp-355 board-a11y — labelBoardFromGameTitle soft-fail', () => {
  it('no-ops when #game-title is absent', () => {
    const board = document.createElement('div');
    labelBoardFromGameTitle(board);
    expect(board.hasAttribute('aria-labelledby')).toBe(false);
    expect(board.hasAttribute('aria-label')).toBe(false);
  });

  it('no-ops when aria-labelledby already set (does not overwrite)', () => {
    document.body.innerHTML = '<h1 id="game-title">Hex</h1>';
    const board = document.createElement('div');
    board.setAttribute('aria-labelledby', 'other-title');
    labelBoardFromGameTitle(board);
    expect(board.getAttribute('aria-labelledby')).toBe('other-title');
  });
});

describe('q-mp-355 board-a11y — deep rowgroup ancestor soft path', () => {
  it('marks outer as rowgroup and mid as presentation under nested layout', () => {
    // grid → outer → mid → nest(cells) — nest promotes to row; chain length ≥ 2
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const outer = document.createElement('div');
    const mid = document.createElement('div');
    const nest = document.createElement('div');
    board.appendChild(outer);
    outer.appendChild(mid);
    mid.appendChild(nest);
    nest.append(makeCell(0, 0), makeCell(0, 1));
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    expect(nest.getAttribute('role')).toBe('row');
    expect(outer.getAttribute('role')).toBe('rowgroup');
    expect(mid.getAttribute('role')).toBe('presentation');
    expect(board.querySelectorAll('.aria-grid-row')).toHaveLength(0);
  });

  it('wrap path under deep nest still walks rowgroup ancestors', () => {
    // Multiple data-row keys → wrap instead of promote; parent ≠ grid
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const outer = document.createElement('div');
    const mid = document.createElement('div');
    const nest = document.createElement('div');
    board.appendChild(outer);
    outer.appendChild(mid);
    mid.appendChild(nest);
    nest.append(makeCell(0, 0), makeCell(1, 0));
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    expect(nest.getAttribute('role')).not.toBe('row');
    expect(nest.querySelectorAll(':scope > [role="row"]').length).toBe(2);
    expect(outer.getAttribute('role')).toBe('rowgroup');
    expect(mid.getAttribute('role')).toBe('presentation');
  });

  it('skips orphan gridcell when parentElement is null (detached soft-fail)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const cell = makeCell(0, 0);
    board.appendChild(cell);
    document.body.appendChild(board);

    Object.defineProperty(cell, 'parentElement', {
      configurable: true,
      get: () => null,
    });

    ensureAriaGridRows(board);
    // Soft-skipped — no wrapper row created for the detached parent path.
    expect(board.querySelectorAll('[role="row"]')).toHaveLength(0);
    expect(cell.getAttribute('role')).toBe('gridcell');
  });
});

describe('q-mp-355 board-a11y — bindGridNavigation keyboard soft-fails', () => {
  function captureKeydownHandler(board: Element): (e: KeyboardEvent) => void {
    let handler: ((e: Event) => void) | undefined;
    const spy = vi
      .spyOn(board, 'addEventListener')
      .mockImplementation((type, fn, options) => {
        if (type === 'keydown' && typeof fn === 'function') {
          handler = fn as (e: Event) => void;
        }
        EventTarget.prototype.addEventListener.call(board, type, fn, options);
      });
    bindGridNavigation(board);
    spy.mockRestore();
    if (!handler) {
      throw new Error('expected keydown handler');
    }
    return handler as (e: KeyboardEvent) => void;
  }

  it('soft-returns when keydown target is not HTML/SVG focusable', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    board.append(a, b);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    const onKey = captureKeydownHandler(board);
    a.focus();

    const prevented = vi.fn();
    onKey({
      key: 'ArrowRight',
      target: document.createTextNode('x'),
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    expect(prevented).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(a);
    expect(a.getAttribute('tabindex')).toBe('0');
  });

  it('soft-returns when gridcell target is outside the bound board', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    board.appendChild(a);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    const onKey = captureKeydownHandler(board);

    const outsider = makeCell(0, 1);
    document.body.appendChild(outsider);
    outsider.focus();

    const prevented = vi.fn();
    onKey({
      key: 'ArrowRight',
      target: outsider,
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    expect(prevented).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(outsider);
    expect(a.getAttribute('tabindex')).toBe('0');
  });
});

describe('q-mp-355 board-a11y — captureFocusedCell soft-fail', () => {
  it('returns null when document.activeElement is null', () => {
    const container = document.createElement('div');
    container.appendChild(makeCell(0, 0));
    document.body.appendChild(container);

    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => null,
    });
    try {
      expect(captureFocusedCell(container)).toBeNull();
    } finally {
      Reflect.deleteProperty(document, 'activeElement');
    }
  });
});

describe('q-mp-355 board-a11y — documented defensive residuals', () => {
  it.skip('equivalent: rowCells.length === 0 — Map lists never stored empty (L193)', () => {
    // Reason: byRow lists are created only when a cell is pushed.
  });

  it.skip('equivalent: ensureRowgroupAncestors from===grid / !contains (L245)', () => {
    // Reason: public wrap/promote paths only pass in-grid orphan parents ≠ grid.
  });
});
