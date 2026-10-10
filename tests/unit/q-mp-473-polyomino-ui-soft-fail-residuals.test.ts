/**
 * q-mp-473 — Characterize `polyomino-ui` soft-fail residuals (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post914` (`753052a6`):
 *   `polyomino-ui.ts` **578** LOC / **2** dedicated `*polyomino-ui*` files
 *     (burn-wave23 + mutation-ui8) before this suite; many `*poly-ui*` /
 *     overnight leftovers already exist but no soft-fail residual ticket owns
 *     the host after tip post898 / engine r11.
 *   Coverage (poly-ui + engine r11 suites): stmts/lines/funcs/branches **100%**
 *     — soft-fail residual value is contract ownership, not uncovered lines.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#874` / engine-coverage-round-11 — OOB placement skip + viewBox fallbacks
 *   `#847` / q-mp-354 — `transform.ts` edges (do not touch transform product)
 *   `#778` / mutation-ui8 — DEFAULT cellSize/padding geometry
 *   `#935` / engine r15 into post898 — no polyomino-ui host; leave **contained**
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites, unknown-shape / empty-catalog skip, sparse-cell fill,
 *   partial dataset click soft-ignore, null dataTransfer drag soft no-op,
 *   inject claimed-id soft-skip, canFlip=false soft-omit, hover null soft edges.
 *
 * Constraints: tests only; no src / AI / scoring / rules / copy-body asserts;
 * no placement.ts / transform.ts product edits; Hex Hard stays 450ms; no network.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createBoard, type Board } from '../../src/core/polyomino/placement';
import {
  createDraggableShape,
  createInteractiveBoard,
  createRotationControls,
  createShapeSelector,
  getCellFromMouseEvent,
  injectPolyominoStyles,
  renderBoard,
  renderPlacementPreview,
  renderPolyomino,
} from '../../src/core/polyomino/polyomino-ui';
import {
  SIMPLE_SHAPES,
  type PolyominoShape,
} from '../../src/core/polyomino/types';

const POLYOMINO_UI_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/polyomino/polyomino-ui.ts'
  ),
  'utf8'
);

const mono = (): PolyominoShape => {
  const shape = SIMPLE_SHAPES.find((s) => s.id === 'monomino');
  if (!shape) {
    throw new Error('monomino missing from SIMPLE_SHAPES');
  }
  return shape;
};

const domino = (): PolyominoShape => {
  const shape = SIMPLE_SHAPES.find((s) => s.id === 'domino');
  if (!shape) {
    throw new Error('domino missing from SIMPLE_SHAPES');
  }
  return shape;
};

afterEach(() => {
  document.body.innerHTML = '';
  document.querySelectorAll('#polyomino-styles').forEach((el) => el.remove());
  vi.restoreAllMocks();
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-473 polyomino-ui — source soft-fail keep-sites', () => {
  it('keeps unknown-shape placement soft-skip', () => {
    expect(POLYOMINO_UI_SRC).toMatch(/if\s*\(\s*!shape\s*\)\s*\{\s*continue;/);
  });

  it('keeps sparse board cell optional-chain fill soft-fail', () => {
    expect(POLYOMINO_UI_SRC).toMatch(
      /board\.cells\[r\]\?\.\[c\]\s*\?\s*'#e0e0e0'\s*:\s*'#fff'/
    );
  });

  it('keeps OOB placement-cell soft-skip bounds guard', () => {
    expect(POLYOMINO_UI_SRC).toMatch(/cell\.row\s*>=\s*0/);
    expect(POLYOMINO_UI_SRC).toMatch(/cell\.row\s*<\s*board\.rows/);
    expect(POLYOMINO_UI_SRC).toMatch(/cell\.col\s*<\s*board\.cols/);
  });

  it('keeps dataTransfer optional soft-set and inject id soft-skip', () => {
    expect(POLYOMINO_UI_SRC).toMatch(/e\.dataTransfer\?\.setData\(/);
    expect(POLYOMINO_UI_SRC).toMatch(
      /if\s*\(\s*document\.getElementById\('polyomino-styles'\)\s*\)\s*\{\s*return;/
    );
  });

  it('keeps interactive click partial-dataset soft-ignore + hover OOB null', () => {
    expect(POLYOMINO_UI_SRC).toMatch(
      /target\.dataset\.row\s*!==\s*undefined\s*&&\s*target\.dataset\.col\s*!==\s*undefined/
    );
    expect(POLYOMINO_UI_SRC).toMatch(/onCellHover\(null\)/);
  });

  it('keeps getCellFromMouseEvent viewBox → attr → rect → 1 soft-fallback chain', () => {
    expect(POLYOMINO_UI_SRC).toMatch(
      /viewBox\s*&&\s*viewBox\.width\s*>\s*0\s*\?\s*viewBox\.width/
    );
    expect(POLYOMINO_UI_SRC).toMatch(
      /Number\(boardElement\.getAttribute\('width'\)\)\s*\|\|\s*rect\.width\s*\|\|\s*1/
    );
    expect(POLYOMINO_UI_SRC).toMatch(
      /Number\(boardElement\.getAttribute\('height'\)\)\s*\|\|\s*rect\.height\s*\|\|\s*1/
    );
  });
});

// =============================================================================
// 2. renderBoard — unknown / empty catalog / sparse / OOB soft-skips
// =============================================================================

describe('q-mp-473 polyomino-ui — renderBoard soft-skip residuals', () => {
  it('unknown shapeId soft-skips overlay without throwing', () => {
    const board: Board = {
      ...createBoard(2, 2),
      placements: [
        {
          shapeId: 'ghost-not-in-catalog',
          position: { row: 0, col: 0 },
          rotation: 0,
          flipped: false,
        },
      ],
    };
    const svg = renderBoard(board, [mono()], { cellSize: 10, padding: 0 });
    // 1 bg + 4 grid; ghost soft-skipped → no colored overlays
    expect(svg.querySelectorAll('rect')).toHaveLength(5);
    const colored = [...svg.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === mono().color
    );
    expect(colored).toHaveLength(0);
  });

  it('empty shapes catalog soft-skips every placement overlay', () => {
    const board: Board = {
      ...createBoard(2, 2),
      placements: [
        {
          shapeId: 'monomino',
          position: { row: 0, col: 0 },
          rotation: 0,
          flipped: false,
        },
        {
          shapeId: 'domino',
          position: { row: 1, col: 0 },
          rotation: 0,
          flipped: false,
        },
      ],
    };
    const svg = renderBoard(board, [], { cellSize: 10, padding: 0 });
    expect(svg.querySelectorAll('rect')).toHaveLength(5);
  });

  it('sparse missing row soft-fails occupied fill to empty #fff', () => {
    // board.cells[r]?.[c] — when the row array is absent, fill soft-fails to #fff
    // rather than throwing. Occupied truthy path still paints #e0e0e0 on row 0.
    const board: Board = {
      ...createBoard(2, 2),
      cells: [[true, false], undefined as unknown as boolean[]],
    };

    const svg = renderBoard(board, [], { cellSize: 10, padding: 0 });
    const occupied = svg.querySelector(
      '[data-row="0"][data-col="0"]'
    ) as SVGRectElement | null;
    const sparse = svg.querySelector(
      '[data-row="1"][data-col="0"]'
    ) as SVGRectElement | null;
    expect(occupied?.getAttribute('fill')).toBe('#e0e0e0');
    expect(sparse?.getAttribute('fill')).toBe('#fff');
  });

  it('OOB placement cell soft-skips without painting outside the grid', () => {
    // Distinct from r11 domino OOB: single monomino placed fully outside board.
    const board: Board = {
      ...createBoard(2, 2),
      placements: [
        {
          shapeId: 'monomino',
          position: { row: 5, col: 5 },
          rotation: 0,
          flipped: false,
        },
      ],
    };
    const svg = renderBoard(board, [mono()], { cellSize: 10, padding: 0 });
    const colored = [...svg.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === mono().color
    );
    expect(colored).toHaveLength(0);
    expect(svg.querySelectorAll('rect')).toHaveLength(5);
  });
});

// =============================================================================
// 3. Interactive — partial dataset / hover soft-nulls
// =============================================================================

describe('q-mp-473 polyomino-ui — interactive soft-ignore residuals', () => {
  it('click with only dataset.row soft-ignores (no onCellClick)', () => {
    const clicks: unknown[] = [];
    const el = createInteractiveBoard(
      createBoard(2, 2),
      [],
      (c) => clicks.push(c),
      () => {}
    );
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
    const decoy = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    decoy.dataset.row = '0';
    // col intentionally absent — both arms required
    svg!.appendChild(decoy);
    decoy.dispatchEvent(new Event('click', { bubbles: true }));
    expect(clicks).toEqual([]);
  });

  it('click with only dataset.col soft-ignores (no onCellClick)', () => {
    const clicks: unknown[] = [];
    const el = createInteractiveBoard(
      createBoard(2, 2),
      [],
      (c) => clicks.push(c),
      () => {}
    );
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
    const decoy = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    decoy.dataset.col = '1';
    svg!.appendChild(decoy);
    decoy.dispatchEvent(new Event('click', { bubbles: true }));
    expect(clicks).toEqual([]);
  });

  it('mousemove OOB and mouseleave both soft-report null hover', () => {
    const hovers: Array<[number, number] | null> = [];
    const el = createInteractiveBoard(
      createBoard(2, 2),
      [],
      () => {},
      (c) => hovers.push(c ? [c.row, c.col] : null),
      { cellSize: 10, padding: 0 }
    );
    const svg = el.querySelector('svg')!;
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 20, height: 20 }),
    });
    svg.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true })
    );
    expect(hovers.at(-1)).toBeNull();
    svg.dispatchEvent(new Event('mouseleave'));
    expect(hovers.at(-1)).toBeNull();
    expect(hovers.filter((h) => h === null).length).toBeGreaterThanOrEqual(2);
  });
});

// =============================================================================
// 4. Drag / inject / rotation soft-fail residuals
// =============================================================================

describe('q-mp-473 polyomino-ui — drag / inject / controls soft-fail', () => {
  it('dragstart soft-succeeds when dataTransfer is absent (no throw)', () => {
    const shape = createDraggableShape(domino(), 90, true, { cellSize: 12 });
    // Omit dataTransfer entirely — `?.setData` soft no-op; opacity still drops.
    const start = new Event('dragstart', { bubbles: true });
    expect(() => shape.dispatchEvent(start)).not.toThrow();
    expect(shape.style.opacity).toBe('0.5');
    expect(shape.dataset.shapeId).toBe('domino');
    expect(shape.dataset.rotation).toBe('90');
    expect(shape.dataset.flipped).toBe('true');
    shape.dispatchEvent(new Event('dragend'));
    expect(shape.style.opacity).toBe('1');
  });

  it('skips inject when #polyomino-styles already exists (non-style host)', () => {
    const claim = document.createElement('div');
    claim.id = 'polyomino-styles';
    document.head.appendChild(claim);

    injectPolyominoStyles();

    // Soft-fail: early return leaves the claimed node; no extra <style> added.
    expect(document.querySelectorAll('#polyomino-styles')).toHaveLength(1);
    expect(document.querySelector('style#polyomino-styles')).toBeNull();
    expect(claim.tagName.toLowerCase()).toBe('div');
    expect(claim.textContent).toBe('');
  });

  it('injects a real style tag when the id is free, then soft-skips repeats', () => {
    injectPolyominoStyles();
    const first = document.getElementById('polyomino-styles');
    expect(first?.tagName.toLowerCase()).toBe('style');
    expect((first?.textContent ?? '').length).toBeGreaterThan(0);
    expect(first?.textContent).toContain('.polyomino');
    expect(first?.textContent).toContain('.placement-preview');

    injectPolyominoStyles();
    expect(document.querySelectorAll('#polyomino-styles')).toHaveLength(1);
    expect(document.getElementById('polyomino-styles')).toBe(first);
  });

  it('canFlip=false soft-omits flip control (two rotate buttons only)', () => {
    const rotates: Array<'cw' | 'ccw'> = [];
    const flips: number[] = [];
    const el = createRotationControls(
      (d) => rotates.push(d),
      () => flips.push(1),
      false
    );
    const buttons = el.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    buttons[0]?.dispatchEvent(new Event('click'));
    buttons[1]?.dispatchEvent(new Event('click'));
    expect(rotates).toEqual(['ccw', 'cw']);
    expect(flips).toEqual([]);
  });
});

// =============================================================================
// 5. Preview / selector / hit-test soft edges (structural)
// =============================================================================

describe('q-mp-473 polyomino-ui — preview / selector / hit-test soft edges', () => {
  it('empty shape selector soft-mounts with zero options', () => {
    const picked: string[] = [];
    const panel = createShapeSelector([], (s) => picked.push(s.id));
    expect(panel.className).toBe('shape-selector');
    expect(panel.querySelectorAll('.shape-option')).toHaveLength(0);
    expect(picked).toEqual([]);
  });

  it('invalid preview soft-paints invalidColor without throwing', () => {
    const filled = createBoard(1, 1);
    filled.cells[0]![0] = true;
    const preview = renderPlacementPreview(
      filled,
      mono(),
      { row: 0, col: 0 },
      0,
      false,
      {
        cellSize: 10,
        padding: 0,
        invalidColor: '#aabbcc',
        highlightColor: '#112233',
      }
    );
    expect(preview.classList.contains('placement-preview')).toBe(true);
    expect(preview.querySelector('rect')?.getAttribute('fill')).toBe('#aabbcc');
    expect(preview.querySelector('rect')?.getAttribute('fill-opacity')).toBe(
      '0.4'
    );
  });

  it('getCellFromMouseEvent soft-falls to attr sizes when viewBox is zero', () => {
    // Complements r11: pins attr arm with non-square board attrs.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '40');
    Object.defineProperty(svg, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 60, height: 40 }),
    });
    expect(
      getCellFromMouseEvent(
        new MouseEvent('click', { clientX: 25, clientY: 15 }),
        svg,
        { cellSize: 10, padding: 0 }
      )
    ).toEqual({ row: 1, col: 2 });
  });

  it('renderPolyomino soft-defaults config merge (partial override)', () => {
    // Partial config must soft-merge DEFAULT_CONFIG — padding stays 2 when omitted.
    const svg = renderPolyomino(mono(), 0, false, { cellSize: 20 });
    // width = 1*20 + 2*2 = 24
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
    expect(svg.classList.contains('polyomino')).toBe(true);
    expect(svg.dataset.shapeId).toBe('monomino');
    expect(svg.querySelectorAll('rect')).toHaveLength(1);
  });
});
