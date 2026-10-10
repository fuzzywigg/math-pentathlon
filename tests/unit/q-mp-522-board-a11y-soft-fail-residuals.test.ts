/**
 * q-mp-522 — Characterize `src/ui/board-a11y.ts` soft-fail residuals
 * (tests-only).
 *
 * Structural asserts only (roles / tabindex / ids / call counts / null
 * returns). No player-facing aria/label/announcement string pins. No `src/`
 * product edits. No AI / rules / scoring / timing paths. Hex Hard 450ms
 * untouched.
 *
 * Live tip re-measure (`cursor/mp-tip-post949` @ tip HEAD):
 * - `board-a11y.ts` **545** LOC (matches backlog)
 * - Dedicated `*board-a11y*` basename files before this suite: **7**
 * - Prior soft-fail char `#844`/`q-mp-355` + tip nnnull clear `#916`/`q-mp-424`
 *   cover empty-board / deep-rowgroup / detached-parent / non-focusable +
 *   out-of-board keydown / null `activeElement`. This file owns post-clear
 *   residual soft-fail arms still thin after those.
 *
 * Ownership: leave tip `#916`/`424` nnnull fold and open `#844`/`355` with
 * `contained`. Mutation `q-mp-527` / wave 18 may share the host — this suite
 * sticks to soft-fail / early-return catch arms only (no mutation kill JSON).
 * No ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyRovingTabindex,
  bindBoardCellKeys,
  bindCellActivateKeys,
  bindGridNavigation,
  captureFocusedCell,
  collectGridCells,
  ensureAriaGridRows,
  labelBoardFromGameTitle,
  makeGridCell,
  markBoardAsGrid,
  restoreFocusedCell,
  type BoardFocusable,
} from '../../src/ui/board-a11y';

const BOARD_A11Y_SRC = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../../src/ui/board-a11y.ts'),
  'utf8'
);

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

// =============================================================================
// 1. Source soft-fail keep-sites (post-nnnull null guards)
// =============================================================================

describe('q-mp-522 board-a11y — source soft-fail keep-sites', () => {
  it('keeps post-nnnull null guards on rowCells / chain / next attrs', () => {
    expect(BOARD_A11Y_SRC).toMatch(
      /const first = rowCells\[0\];\s*if \(!first\)/
    );
    expect(BOARD_A11Y_SRC).toMatch(
      /const top = chain\[chain\.length - 1\];\s*if \(!top\)/
    );
    expect(BOARD_A11Y_SRC).toMatch(/const el = chain\[i\];\s*if \(!el\)/);
    expect(BOARD_A11Y_SRC).toMatch(
      /if \(nextRow === null \|\| nextCol === null\)/
    );
  });

  it('keeps labelBoardFromGameTitle / capture / focus soft early-returns', () => {
    expect(BOARD_A11Y_SRC).toMatch(/if \(!title\?\.id\)/);
    expect(BOARD_A11Y_SRC).toMatch(
      /if \(row === null \|\| col === null\)\s*\{\s*return null;/
    );
    expect(BOARD_A11Y_SRC).toMatch(
      /if \(from === grid \|\| !grid\.contains\(from\)\)/
    );
  });
});

// =============================================================================
// 2. labelBoardFromGameTitle soft-fail residuals
// =============================================================================

describe('q-mp-522 board-a11y — labelBoardFromGameTitle soft-fail residuals', () => {
  it('no-ops when aria-label is already set (does not overwrite)', () => {
    const title = document.createElement('h1');
    title.id = 'game-title';
    document.body.appendChild(title);
    const board = document.createElement('div');
    board.setAttribute('aria-label', 'preexisting');
    labelBoardFromGameTitle(board);
    expect(board.getAttribute('aria-label')).toBe('preexisting');
    expect(board.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('no-ops when #game-title exists but has an empty id', () => {
    const title = document.createElement('h1');
    title.id = '';
    document.body.appendChild(title);
    const board = document.createElement('div');
    labelBoardFromGameTitle(board);
    expect(board.hasAttribute('aria-labelledby')).toBe(false);
    expect(board.hasAttribute('aria-label')).toBe(false);
  });
});

// =============================================================================
// 3. ensureAriaGridRows / empty-query soft paths
// =============================================================================

describe('q-mp-522 board-a11y — ensureAriaGridRows soft-fail residuals', () => {
  it('no-ops when root is not a grid and has no nested grids', () => {
    const root = document.createElement('div');
    const stray = makeCell(0, 0);
    root.appendChild(stray);
    document.body.appendChild(root);

    ensureAriaGridRows(root);

    expect(root.querySelectorAll('[role="row"]')).toHaveLength(0);
    expect(stray.parentElement).toBe(root);
    expect(stray.getAttribute('role')).toBe('gridcell');
    expect(stray.getAttribute('tabindex')).toBe('-1');
  });
});

// =============================================================================
// 4. bindGridNavigation keyboard soft-fail residuals
// =============================================================================

describe('q-mp-522 board-a11y — bindGridNavigation soft-fail residuals', () => {
  it('soft-returns when keydown target role is not gridcell', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    board.append(a, b);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    const onKey = captureKeydownHandler(board);
    a.focus();

    const buttonish = document.createElement('button');
    board.appendChild(buttonish);
    buttonish.focus();

    const prevented = vi.fn();
    onKey({
      key: 'ArrowRight',
      target: buttonish,
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    expect(prevented).not.toHaveBeenCalled();
    expect(a.getAttribute('tabindex')).toBe('0');
    expect(b.getAttribute('tabindex')).toBe('-1');
  });

  it('soft-returns when arrow has no neighbor (edge of board)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const only = makeCell(0, 0);
    board.appendChild(only);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    const onKey = captureKeydownHandler(board);
    only.focus();

    const prevented = vi.fn();
    onKey({
      key: 'ArrowUp',
      target: only,
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    expect(prevented).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(only);
    expect(only.getAttribute('tabindex')).toBe('0');
  });

  it('soft-returns on non-arrow keys without touching roving tabindex', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    board.append(a, b);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board), { row: '0', col: '0' });
    const onKey = captureKeydownHandler(board);
    a.focus();

    const prevented = vi.fn();
    onKey({
      key: 'Enter',
      target: a,
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    expect(prevented).not.toHaveBeenCalled();
    expect(a.getAttribute('tabindex')).toBe('0');
    expect(b.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(a);
  });

  it('soft-returns when data-row/col are non-finite', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const broken = document.createElement('div');
    broken.dataset.row = 'NaN';
    broken.dataset.col = 'x';
    makeGridCell(broken, 'broken');
    const ok = makeCell(0, 1);
    board.append(broken, ok);
    document.body.appendChild(board);
    applyRovingTabindex([broken, ok], { row: 'NaN', col: 'x' });
    const onKey = captureKeydownHandler(board);
    broken.focus();

    const prevented = vi.fn();
    onKey({
      key: 'ArrowRight',
      target: broken,
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    expect(prevented).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(broken);
    expect(broken.getAttribute('tabindex')).toBe('0');
  });
});

// =============================================================================
// 5. capture / restore / activate soft-fail residuals
// =============================================================================

describe('q-mp-522 board-a11y — capture/restore/activate soft-fail residuals', () => {
  it('captureFocusedCell returns null when only one of data-row/col is set', () => {
    const container = document.createElement('div');
    const rowOnly = document.createElement('div');
    rowOnly.dataset.row = '1';
    rowOnly.tabIndex = 0;
    makeGridCell(rowOnly, 'row-only');
    const colOnly = document.createElement('div');
    colOnly.dataset.col = '2';
    colOnly.tabIndex = 0;
    makeGridCell(colOnly, 'col-only');
    container.append(rowOnly, colOnly);
    document.body.appendChild(container);

    rowOnly.focus();
    expect(captureFocusedCell(container)).toBeNull();
    colOnly.focus();
    expect(captureFocusedCell(container)).toBeNull();
  });

  it('restoreFocusedCell soft-no-ops when focus snapshot is null', () => {
    const container = document.createElement('div');
    const keep = makeCell(0, 0);
    keep.tabIndex = 0;
    container.appendChild(keep);
    document.body.appendChild(container);
    keep.focus();

    restoreFocusedCell(container, null);
    expect(document.activeElement).toBe(keep);
    expect(keep.getAttribute('tabindex')).toBe('0');
  });

  it('bindCellActivateKeys soft-returns on non-activate keys', () => {
    const cell = document.createElement('div');
    document.body.appendChild(cell);
    const onActivate = vi.fn();
    bindCellActivateKeys(cell, onActivate);

    const escape = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    const tab = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    cell.dispatchEvent(escape);
    cell.dispatchEvent(tab);

    expect(onActivate).not.toHaveBeenCalled();
    expect(escape.defaultPrevented).toBe(false);
    expect(tab.defaultPrevented).toBe(false);
  });

  it('bindBoardCellKeys soft-returns when isCell rejects the target', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.tabIndex = 0;
    const other = document.createElement('div');
    other.tabIndex = 0;
    board.append(cell, other);
    document.body.appendChild(board);

    const onActivate = vi.fn();
    bindBoardCellKeys(
      board,
      (el: BoardFocusable) => el.classList.contains('cell'),
      onActivate
    );

    other.focus();
    other.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      })
    );
    expect(onActivate).not.toHaveBeenCalled();

    cell.focus();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      })
    );
    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(onActivate).toHaveBeenCalledWith(cell);
  });

  it('bindBoardCellKeys soft-returns when keydown target is not BoardFocusable', () => {
    const board = document.createElement('div');
    document.body.appendChild(board);
    const onActivate = vi.fn();
    let handler: ((e: Event) => void) | undefined;
    const spy = vi
      .spyOn(board, 'addEventListener')
      .mockImplementation((type, fn, options) => {
        if (type === 'keydown' && typeof fn === 'function') {
          handler = fn as (e: Event) => void;
        }
        EventTarget.prototype.addEventListener.call(board, type, fn, options);
      });
    bindBoardCellKeys(board, () => true, onActivate);
    spy.mockRestore();
    if (!handler) {
      throw new Error('expected keydown handler');
    }

    const prevented = vi.fn();
    handler({
      key: 'Enter',
      target: document.createTextNode('x'),
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    expect(prevented).not.toHaveBeenCalled();
    expect(onActivate).not.toHaveBeenCalled();
  });
});

// =============================================================================
// 6. Documented defensive residuals (not observable via public API)
// =============================================================================

describe('q-mp-522 board-a11y — documented defensive residuals', () => {
  it.skip('equivalent: rowCells[0] empty — Map lists never stored empty (post-nnnull L193)', () => {
    // Reason: byRow lists are created only when a cell is pushed.
  });

  it.skip('equivalent: ensureRowgroupAncestors from===grid / !contains (L245)', () => {
    // Reason: public wrap/promote paths only pass in-grid orphan parents ≠ grid.
  });

  it.skip('equivalent: chain[top]/chain[i] undefined — length guards (post-nnnull L259/L270)', () => {
    // Reason: chain built from parent walk; indexed only when length > 0 / i < length-1.
  });

  it.skip('equivalent: nextRow/nextCol null after findGridNeighbor (post-nnnull L426)', () => {
    // Reason: collectGridCells requires [data-row][data-col]; neighbor attrs stay set.
  });
});
