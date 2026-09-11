/**
 * Thin shared board a11y helpers (Wave 1).
 * Extracted from Kings: focusable cells, Enter/Space, label parts, focus restore, live status.
 * No ARIA grid / arrow roving here — that is Wave 2+.
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

/** Apply Kings-style focusable cell attrs. */
export function makeCellFocusable(cell: HTMLElement, ariaLabel: string): void {
  cell.setAttribute('role', 'button');
  cell.setAttribute('tabindex', '0');
  cell.setAttribute('aria-label', ariaLabel);
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
