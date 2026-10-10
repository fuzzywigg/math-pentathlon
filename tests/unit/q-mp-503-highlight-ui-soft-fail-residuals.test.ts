/**
 * q-mp-503 — Characterize `alignment/highlight-ui` soft-fail residuals (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post914` (`e43a25d2`):
 *   `highlight-ui.ts` **346** LOC / **1** dedicated `*highlight-ui*` file
 *     (`burn-wave22-highlight-ui.test.ts`) before this suite; wave39/40 +
 *     engine r13 leftovers cover className/`empty-path`/`mark` soft edges but
 *     leave overlay/line/path `??` style-fallback arms thin (focused suites:
 *     stmts/lines/funcs **100%**, branches **82.92%** / 34 of 41).
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#874` / q-mp-349 engine r11 — fraction-bar + polyomino; leave **contained**
 *   `#899` / q-mp-401 engine r13 — className `?? ''` arms; leave **contained**
 *   `#722` / q-mp-185 nullish product clear — src HOLD; leave open
 *   Undrafted `q-mp-407` contiguous char — disjoint host; leave alone
 *   Mutation `507` may share host — keep tests-only; no product edits
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites, overlay fill/stroke/opacity/width `??` wipe,
 *   line/path stroke `??` wipe, animate falsy → no `animated` class,
 *   null className soft-omit, mark miss soft-skip, clear empty-list SVG-only,
 *   inject claimed-id soft-skip (pre-seeded empty style element).
 *
 * Constraints: tests only; no src / AI / scoring / rules / legal-move /
 * copy-body asserts; UI highlight only; Hex Hard stays 450ms; no network.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  HIGHLIGHT_STYLES,
  clearHighlights,
  createAlignmentHighlight,
  createAlignmentLine,
  createHighlightOverlay,
  createPathHighlight,
  createRegionHighlight,
  getHighlightStyles,
  injectHighlightStyles,
  markCellsForHighlight,
  type HighlightStyle,
} from '../../src/core/alignment/highlight-ui';
import {
  DIRECTIONS,
  type AlignmentResult,
  type GridPosition,
  type Region,
} from '../../src/core/alignment/types';

const HIGHLIGHT_UI_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/alignment/highlight-ui.ts'
  ),
  'utf8'
);

const cellToPixel = (row: number, col: number) => ({
  x: col * 40 + 20,
  y: row * 40 + 20,
});
const cellSize = { width: 36, height: 36 };

/** Style with every optional key wiped so `??` soft-fail arms fire. */
const UNDEFINED_STYLE = {
  fillColor: undefined,
  fillOpacity: undefined,
  strokeColor: undefined,
  strokeWidth: undefined,
  className: undefined,
  animate: undefined,
  animationDuration: undefined,
} as HighlightStyle;

const SAMPLE_ALIGNMENT: AlignmentResult = {
  value: 'X',
  start: { row: 0, col: 0 },
  end: { row: 0, col: 2 },
  positions: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ],
  direction: DIRECTIONS.HORIZONTAL,
  length: 3,
};

afterEach(() => {
  document.body.innerHTML = '';
  document.head
    .querySelectorAll('#alignment-highlight-styles')
    .forEach((el) => el.remove());
  vi.restoreAllMocks();
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-503 highlight-ui — source soft-fail keep-sites', () => {
  it('keeps overlay fill/stroke/opacity/width ?? soft-fail arms', () => {
    expect(HIGHLIGHT_UI_SRC).toMatch(/style\.fillColor\s*\?\?\s*'transparent'/);
    expect(HIGHLIGHT_UI_SRC).toMatch(/style\.fillOpacity\s*\?\?\s*0\.2/);
    expect(HIGHLIGHT_UI_SRC).toMatch(
      /style\.strokeColor\s*\?\?\s*'transparent'/
    );
    expect(HIGHLIGHT_UI_SRC).toMatch(/style\.strokeWidth\s*\?\?\s*0/);
  });

  it('keeps line + path stroke ?? soft-fail arms and animate ternary', () => {
    expect(HIGHLIGHT_UI_SRC).toMatch(/style\.strokeColor\s*\?\?\s*'#4caf50'/);
    expect(HIGHLIGHT_UI_SRC).toMatch(
      /String\(\(style\.strokeWidth\s*\?\?\s*2\)\s*\*\s*2\)/
    );
    expect(HIGHLIGHT_UI_SRC).toMatch(/style\.strokeColor\s*\?\?\s*'#9c27b0'/);
    expect(HIGHLIGHT_UI_SRC).toMatch(/String\(style\.strokeWidth\s*\?\?\s*2\)/);
    expect(HIGHLIGHT_UI_SRC).toMatch(
      /style\.animate\s*\?\s*'animated'\s*:\s*''/
    );
  });

  it('keeps className ?? soft-omit + missing-cell mark soft-skip + inject skip', () => {
    expect(HIGHLIGHT_UI_SRC).toMatch(/style\.className\s*\?\?\s*''/);
    expect(HIGHLIGHT_UI_SRC).toMatch(/if\s*\(\s*cell\s*\)\s*\{/);
    expect(HIGHLIGHT_UI_SRC).toMatch(
      /if\s*\(\s*!document\.getElementById\(styleId\)\s*\)/
    );
    expect(HIGHLIGHT_UI_SRC).toMatch(/if\s*\(\s*path\.length\s*<\s*2\s*\)/);
  });
});

// =============================================================================
// 2. Overlay — style wipe soft-fails
// =============================================================================

describe('q-mp-503 highlight-ui — overlay style wipe soft-fails', () => {
  it('UNDEFINED_STYLE soft-falls rect attributes to transparent / 0.2 / 0', () => {
    const group = createHighlightOverlay(
      [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ],
      cellToPixel,
      cellSize,
      UNDEFINED_STYLE
    );
    expect(group.getAttribute('class')).toBe('alignment-highlight ');
    const rects = [...group.querySelectorAll('rect')];
    expect(rects).toHaveLength(2);
    expect(rects[0]?.getAttribute('fill')).toBe('transparent');
    expect(rects[0]?.getAttribute('fill-opacity')).toBe('0.2');
    expect(rects[0]?.getAttribute('stroke')).toBe('transparent');
    expect(rects[0]?.getAttribute('stroke-width')).toBe('0');
    expect(rects[0]?.getAttribute('rx')).toBe('4');
  });

  it('empty style object hits the same overlay ?? arms as UNDEFINED_STYLE', () => {
    const group = createHighlightOverlay(
      [{ row: 2, col: 3 }],
      cellToPixel,
      cellSize,
      {}
    );
    const rect = group.querySelector('rect');
    expect(group.getAttribute('class')).toBe('alignment-highlight ');
    expect(rect?.getAttribute('fill')).toBe('transparent');
    expect(rect?.getAttribute('fill-opacity')).toBe('0.2');
    expect(rect?.getAttribute('stroke')).toBe('transparent');
    expect(rect?.getAttribute('stroke-width')).toBe('0');
  });

  it('null className soft-omits token on overlay group', () => {
    const style = {
      fillColor: '#111',
      className: null,
    } as unknown as HighlightStyle;
    const group = createHighlightOverlay(
      [{ row: 0, col: 0 }],
      cellToPixel,
      cellSize,
      style
    );
    expect(group.getAttribute('class')).toBe('alignment-highlight ');
    expect(group.querySelector('rect')?.getAttribute('fill')).toBe('#111');
  });
});

// =============================================================================
// 3. Line / path — stroke wipe + animate falsy
// =============================================================================

describe('q-mp-503 highlight-ui — line/path stroke wipe + animate falsy', () => {
  it('createAlignmentLine UNDEFINED_STYLE soft-falls stroke + doubled width', () => {
    const line = createAlignmentLine(
      SAMPLE_ALIGNMENT,
      cellToPixel,
      UNDEFINED_STYLE
    );
    expect(line.getAttribute('stroke')).toBe('#4caf50');
    expect(line.getAttribute('stroke-width')).toBe('4'); // (2 ??) * 2
    expect(line.getAttribute('class')).toBe('highlight-line ');
    expect(line.classList.contains('animated')).toBe(false);
  });

  it('createPathHighlight UNDEFINED_STYLE soft-falls stroke + width; no animated', () => {
    const path = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 1 },
      ],
      cellToPixel,
      UNDEFINED_STYLE
    );
    expect(path.getAttribute('stroke')).toBe('#9c27b0');
    expect(path.getAttribute('stroke-width')).toBe('2');
    expect(path.getAttribute('fill')).toBe('none');
    expect(path.getAttribute('class')).toBe('highlight-line  ');
    expect(path.classList.contains('animated')).toBe(false);
  });

  it('createAlignmentHighlight with wiped style nests soft-fail overlay + line', () => {
    const group = createAlignmentHighlight(
      SAMPLE_ALIGNMENT,
      cellToPixel,
      cellSize,
      UNDEFINED_STYLE
    );
    expect(group.getAttribute('class')).toBe('alignment-highlight ');
    const nested = group.querySelector('g.alignment-highlight');
    expect(nested?.querySelectorAll('rect')).toHaveLength(3);
    const line = group.querySelector('line');
    expect(line?.getAttribute('stroke')).toBe('#4caf50');
    expect(line?.classList.contains('animated')).toBe(false);
  });

  it('explicit animate:false omits animated on threat-like custom stroke', () => {
    const style: HighlightStyle = {
      strokeColor: '#f57c00',
      strokeWidth: 3,
      animate: false,
      className: 'highlight-threat',
    };
    const line = createAlignmentLine(SAMPLE_ALIGNMENT, cellToPixel, style);
    const path = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
      ],
      cellToPixel,
      style
    );
    expect(line.getAttribute('stroke')).toBe('#f57c00');
    expect(line.getAttribute('stroke-width')).toBe('6');
    expect(line.classList.contains('animated')).toBe(false);
    expect(path.getAttribute('class')).toBe('highlight-line  highlight-threat');
  });
});

// =============================================================================
// 4. Mark / clear / inject soft-skips
// =============================================================================

describe('q-mp-503 highlight-ui — mark/clear/inject soft-skips', () => {
  it('markCellsForHighlight soft-skips when every position is missing', () => {
    const board = document.createElement('div');
    const present = document.createElement('div');
    present.dataset.row = '0';
    present.dataset.col = '0';
    board.appendChild(present);
    document.body.appendChild(board);

    const missing: GridPosition[] = [
      { row: 9, col: 9 },
      { row: 8, col: 8 },
    ];
    expect(() =>
      markCellsForHighlight(board, missing, 'highlight-threat')
    ).not.toThrow();
    expect(board.querySelectorAll('.highlight-threat')).toHaveLength(0);
    expect(present.classList.contains('highlight-threat')).toBe(false);
  });

  it('clearHighlights with empty class list still removes SVG overlay groups', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.classList.add('highlight-selected');
    board.appendChild(cell);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.appendChild(
      createHighlightOverlay([{ row: 0, col: 0 }], cellToPixel, cellSize)
    );
    board.appendChild(svg);
    document.body.appendChild(board);

    clearHighlights(board, []);
    expect(cell.classList.contains('highlight-selected')).toBe(true);
    expect(board.querySelectorAll('.alignment-highlight')).toHaveLength(0);
  });

  it('injectHighlightStyles soft-skips when id is already claimed', () => {
    const preexisting = document.createElement('style');
    preexisting.id = 'alignment-highlight-styles';
    preexisting.textContent = '/* claimed */';
    document.head.appendChild(preexisting);

    injectHighlightStyles();
    injectHighlightStyles();
    expect(
      document.querySelectorAll('#alignment-highlight-styles')
    ).toHaveLength(1);
    expect(preexisting.textContent).toBe('/* claimed */');
    expect(preexisting.textContent).not.toContain('.alignment-highlight');
  });

  it('createRegionHighlight empty positions yields empty overlay group', () => {
    const region: Region = { value: null, positions: [], size: 0 };
    const group = createRegionHighlight(
      region,
      cellToPixel,
      cellSize,
      UNDEFINED_STYLE
    );
    expect(group.getAttribute('class')).toBe('alignment-highlight ');
    expect(group.querySelectorAll('rect')).toHaveLength(0);
  });

  it('getHighlightStyles CSS contract keeps reduced-motion soft-disable selectors', () => {
    // Structural CSS selectors only — not player-facing copy.
    const css = getHighlightStyles();
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain("html[data-reduced-motion='true']");
    expect(css).toContain('animation: none !important');
  });

  it('default HIGHLIGHT_STYLES catalog remains four named soft presets', () => {
    const keys = Object.keys(HIGHLIGHT_STYLES).sort();
    expect(keys).toEqual(['path', 'selected', 'threat', 'winning']);
    expect(HIGHLIGHT_STYLES.winning.animate).toBe(true);
    expect(HIGHLIGHT_STYLES.path.animate).toBe(false);
    expect(HIGHLIGHT_STYLES.threat.animationDuration).toBe(500);
  });
});
