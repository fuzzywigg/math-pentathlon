/**
 * Thin shared board a11y helpers.
 * Wave 1: focusable cells, Enter/Space, label parts, focus restore, live status.
 * Wave 2: ARIA grid + one roving tabindex + arrow navigation.
 */

export interface CellLabelParts {
  /** Coordinate or cell identity, e.g. "E2" or "12". */
  coord: string;
  /** Seat / owner name for screen readers (Blue, Red, Player 1, AI, …). */
  owner?: string;
  /** Piece or content name (King, Quadraphage, prime, …). */
  piece?: string;
  /** Empty cell (mutually preferred over owner/piece when true). */
  empty?: boolean;
  /** Announce as a legal move destination (color is not enough). */
  validMove?: boolean;
  /** Announce as a legal placement target. */
  validPlacement?: boolean;
  /** Extra label segments (e.g. "prime"). */
  extras?: string[];
}

/** Build a comma-separated aria-label: coord · owner/piece|empty · valid move/placement. */
export function buildCellAriaLabel(parts: CellLabelParts): string {
  const segments: string[] = [parts.coord];

  if (parts.empty) {
    segments.push('empty');
  } else {
    const mid = [parts.owner, parts.piece].filter(Boolean).join(' ');
    if (mid) segments.push(mid);
  }

  if (parts.extras) {
    for (const extra of parts.extras) {
      if (extra) segments.push(extra);
    }
  }

  if (parts.validMove) segments.push('valid move');
  if (parts.validPlacement) segments.push('valid placement');

  return segments.join(', ');
}

/** Apply Kings-style focusable cell attrs (Wave 1 button pattern). */
export function makeCellFocusable(cell: HTMLElement, ariaLabel: string): void {
  cell.setAttribute('role', 'button');
  cell.setAttribute('tabindex', '0');
  cell.setAttribute('aria-label', ariaLabel);
}

/** Mark a board root as an ARIA grid (Wave 2). */
export function markBoardAsGrid(boardEl: HTMLElement): void {
  boardEl.setAttribute('role', 'grid');
}

/**
 * Apply gridcell role + label. Tabindex defaults to -1; call applyRovingTabindex
 * (or restoreGridFocus) after all cells exist so exactly one is 0.
 */
export function makeGridCell(cell: HTMLElement, ariaLabel: string): void {
  cell.setAttribute('role', 'gridcell');
  cell.setAttribute('tabindex', '-1');
  cell.setAttribute('aria-label', ariaLabel);
}

/**
 * One tab stop among gridcells: preferred coords get tabindex=0, else the first cell.
 * Returns the tabbable cell, or null if there are no cells.
 */
export function applyRovingTabindex(
  cells: HTMLElement[],
  preferred?: FocusedCellCoords | null
): HTMLElement | null {
  if (cells.length === 0) return null;

  let active: HTMLElement | null = null;
  if (preferred) {
    active =
      cells.find(
        (c) =>
          c.dataset.row === preferred.row && c.dataset.col === preferred.col
      ) ?? null;
  }
  if (!active) active = cells[0];

  for (const cell of cells) {
    cell.setAttribute('tabindex', cell === active ? '0' : '-1');
  }
  return active;
}

/** Collect gridcells that carry data-row / data-col. */
export function collectGridCells(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>('[role="gridcell"][data-row][data-col]')
  );
}

/**
 * Find the next gridcell in a cardinal direction, stepping over holes
 * (e.g. Sum Dominoes cells covered by placed dominoes).
 */
export function findGridNeighbor(
  cells: HTMLElement[],
  row: number,
  col: number,
  dRow: number,
  dCol: number
): HTMLElement | null {
  if (cells.length === 0) return null;

  const byCoord = new Map(
    cells.map((c) => [`${c.dataset.row},${c.dataset.col}`, c] as const)
  );

  let minR = Infinity;
  let maxR = -Infinity;
  let minC = Infinity;
  let maxC = -Infinity;
  for (const c of cells) {
    const r = Number(c.dataset.row);
    const colN = Number(c.dataset.col);
    if (!Number.isFinite(r) || !Number.isFinite(colN)) continue;
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
    minC = Math.min(minC, colN);
    maxC = Math.max(maxC, colN);
  }

  let r = row + dRow;
  let c = col + dCol;
  while (r >= minR && r <= maxR && c >= minC && c <= maxC) {
    const found = byCoord.get(`${r},${c}`);
    if (found) return found;
    r += dRow;
    c += dCol;
  }
  return null;
}

/**
 * Arrow-key roving among [data-row][data-col] gridcells inside boardEl.
 * Does not handle Enter/Space — use bindBoardCellKeys / bindCellActivateKeys.
 */
const ARROW_DELTA: Record<string, { dRow: number; dCol: number }> = {
  ArrowUp: { dRow: -1, dCol: 0 },
  ArrowDown: { dRow: 1, dCol: 0 },
  ArrowLeft: { dRow: 0, dCol: -1 },
  ArrowRight: { dRow: 0, dCol: 1 },
};

export function bindGridNavigation(boardEl: HTMLElement): void {
  boardEl.addEventListener('keydown', (e) => {
    const delta = ARROW_DELTA[e.key];
    if (!delta) return;

    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.getAttribute('role') !== 'gridcell') return;
    if (!boardEl.contains(target)) return;

    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    if (!Number.isFinite(row) || !Number.isFinite(col)) return;

    const cells = collectGridCells(boardEl);
    const next = findGridNeighbor(cells, row, col, delta.dRow, delta.dCol);
    if (!next) return;

    e.preventDefault();
    applyRovingTabindex(cells, {
      row: next.dataset.row!,
      col: next.dataset.col!,
    });
    next.focus();
  });
}

/**
 * After a board rebuild: set roving tabindex, then restore focus when we had one.
 * When focus is null, still leaves exactly one tabindex=0 without stealing focus.
 */
export function restoreGridFocus(
  container: HTMLElement,
  focus: FocusedCellCoords | null
): void {
  const cells = collectGridCells(container);
  const active = applyRovingTabindex(cells, focus);
  if (focus && active) {
    active.focus();
  }
}

/** Enter/Space activation on a single cell (Contig / SD / Prime per-cell pattern). */
export function bindCellActivateKeys(
  cell: HTMLElement,
  onActivate: () => void
): void {
  cell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  });
}

/**
 * Enter/Space via event delegation on a board root (Kings pattern).
 * `isCell` should return true only for the focused cell element itself.
 */
export function bindBoardCellKeys(
  boardEl: HTMLElement,
  isCell: (el: HTMLElement) => boolean,
  onActivate: (cell: HTMLElement) => void
): void {
  boardEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const target = e.target;
    if (!(target instanceof HTMLElement) || !isCell(target)) return;
    e.preventDefault();
    onActivate(target);
  });
}

export interface FocusedCellCoords {
  row: string;
  col: string;
}

/** Snapshot focused `[data-row][data-col]` inside a container before innerHTML rebuild. */
export function captureFocusedCell(
  container: HTMLElement
): FocusedCellCoords | null {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return null;
  if (!container.contains(active)) return null;
  const row = active.dataset.row;
  const col = active.dataset.col;
  if (row == null || col == null) return null;
  return { row, col };
}

/** Restore focus to the same `[data-row][data-col]` after a rebuild. */
export function restoreFocusedCell(
  container: HTMLElement,
  focus: FocusedCellCoords | null
): void {
  if (!focus) return;
  const cell = container.querySelector(
    `[data-row="${focus.row}"][data-col="${focus.col}"]`
  );
  if (cell instanceof HTMLElement) {
    cell.focus();
  }
}

/** Mark a status root as a polite live region. */
export function markStatusLive(el: HTMLElement): void {
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
}
