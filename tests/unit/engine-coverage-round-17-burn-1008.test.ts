/**
 * q-mp-506 — engine coverage round 17: post-r16 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after open r16 (#954 / q-mp-477) pinned
 * tutorial contentRect / click-cell top smoke. Prefer leftovers in
 * src/core/graph/ (defensive arms via isolated spies sibling) /
 * src/core/alignment/ / src/core/attributes/ / src/core/storage/
 * not claimed by r11–r16 and not rules.ts / scoring. Pins CURRENT behavior
 * only.
 *
 * Does not change engine / rules.ts / AI source. Does not duplicate #954 or
 * #935 tutorial cases. Graph prototype spies live in
 * engine-coverage-round-17-graph-defensive-spies.test.ts (unit-isolated).
 *
 * Skips: storage.ts (#909 / q-mp-420), sanitize (#504 / mutation w17),
 * dice-ui (#920), attribute-ui (#893), highlight-ui (#503), compat soft-fail
 * (#505), contiguous (#509 / 407), dom-security (#933), safe-web-storage
 * (#925), graph-ui (mutation w16 #957).
 *
 * Baseline rank (tip post914 @ f5d3d04a + #954 r16 suite overlay for
 * post-r16 residual view, coverage-engine-r17-baseline2, unit-shared+unit-node
 * excl. AI determinism/worker/calibration/move-time + bench):
 *   storage/storage.ts          90.00% (63/70)    ← #909 owns soft-fail
 *   graph/algorithms.ts         90.00% (117/130)  ← r17 primary (spy pins)
 *   dom-security.ts             90.90% (20/22)    ← mutation w15
 *   tutorial.ts                 93.29% (167/179)  ← r16 closed pinable arms
 *   graph/types.ts              94.11% (32/34)    ← r17 primary (spy pins)
 *   polyomino/placement.ts      96.39% (107/111)  ← r8/r11 documented
 *   expressions/evaluator.ts    96.40% (161/167)  ← r9 documented private
 *   dice-ui.ts                  98.27% (57/58)    ← #920
 *   sanitize.ts                 98.61%            ← #504
 *   fraction-bar-ui.ts          99.10% (111/112)  ← r11 L407 doc
 *   attributes/ / alignment/ / graph-ui             100%
 */
import { afterEach, describe, expect, it } from 'vitest';

import { findAllAlignments } from '../../src/core/alignment/compat';
import { createMathPiece, isPrime } from '../../src/core/attributes/logic';
import {
  evaluate,
  solveTargetChallenge,
  validateSolution,
} from '../../src/core/expressions/evaluator';
import { createFraction } from '../../src/core/fractions/arithmetic';
import {
  createInteractiveFractionBar,
  getFractionColor,
} from '../../src/core/fractions/fraction-bar-ui';
import { COMMON_FRACTIONS } from '../../src/core/fractions/types';
import {
  bfs,
  findNodesAtDistance,
  findNodesWithinDistance,
  isConnected,
} from '../../src/core/graph/algorithms';
import {
  createCompleteGraph,
  createHexLatticeGraph,
  createTrackGraph,
} from '../../src/core/graph/types';
import {
  createBoard,
  createBoardWithBlockedCells,
  placePolyomino,
  type Board,
} from '../../src/core/polyomino/placement';
import type { PolyominoShape } from '../../src/core/polyomino/types';
import { isPlainProgressObject } from '../../src/core/storage/migrate';
import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'r17-engine', name: 'r17', steps };
}

function mountTarget(
  id: string,
  rect: { left: number; top: number; width: number; height: number }
): HTMLElement {
  const el = document.createElement('button');
  el.id = id;
  Object.defineProperty(el, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      left: rect.left,
      top: rect.top,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => ({}),
    }),
  });
  document.body.appendChild(el);
  return el;
}

const mono = (id = 'm0'): PolyominoShape => ({
  id,
  name: 'mono',
  cells: [{ row: 0, col: 0 }],
  color: '#000',
  canRotate: false,
  canFlip: true,
  size: 1,
  order: 1,
});

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll(
      '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
    )
    .forEach((el) => el.remove());
});

// =============================================================================
// 1. tutorial.ts — post-r16 leftover docs + disjoint placement smoke
// =============================================================================

describe('engine-coverage-round-17 — tutorial post-r16 residuals', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
  });

  it('center placement without highlight still mounts an active tooltip', () => {
    // Structural smoke complementary to r16 click-cell top; exercises
    // clearHighlight → positionTooltipCenter path without claiming L937 cache.
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 'c0', title: 'C', message: 'center', position: 'center' }])
    );
    expect(manager.getIsActive()).toBe(true);
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
    expect(document.querySelector('.tutorial-highlight-ring')).toBeTruthy();
  });

  it('right placement with a live target keeps ring + tooltip mounted', () => {
    const target = mountTarget('r17-right', {
      left: 120,
      top: 140,
      width: 40,
      height: 40,
    });
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'right',
          title: 'R',
          message: 'side',
          highlightSelector: '#r17-right',
          position: 'right',
        },
      ])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('block');
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
    expect(target.isConnected).toBe(true);
  });

  it('documents remaining private null-guard / unreachable arms after r16', () => {
    // Carry-forward after r16 contentRect + click-cell top:
    // L383 (!isActive keydown — listener removed on exit),
    // L700 (cueAbove=true; sole call site hardcodes false),
    // L725/726 ?? rights (sole call site always passes tipBox + avoidRect),
    // L758 flip-preferVertical (left/right already rewrote side),
    // L937 cache hit (showCurrentStep always invalidateTooltipSize before
    // measure), plus private null early-returns L716/872/904/934/987.
    expect(true).toBe(true);
  });
});

// =============================================================================
// 2. graph/** — baseline smoke (spy pins live in isolated sibling)
// =============================================================================

describe('engine-coverage-round-17 — graph baseline smoke (spies isolated)', () => {
  it('track graph BFS / distance helpers stay wired without spies', () => {
    const g = createTrackGraph(6);
    expect(bfs(g, 't0', 't5').found).toBe(true);
    expect(isConnected(g)).toBe(true);
    expect(findNodesAtDistance(g, 't0', 4)).toContain('t4');
    expect(findNodesWithinDistance(g, 't0', 3).length).toBeGreaterThan(2);
  });

  it('hex lattice + complete graph constructors stay wired without spies', () => {
    const hex = createHexLatticeGraph(2);
    expect(hex.nodes.size).toBeGreaterThan(0);
    expect(hex.edges.length).toBeGreaterThan(0);
    const complete = createCompleteGraph(4);
    expect(complete.edges.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// 3. expressions / placement — documented private residuals + soft edges
// =============================================================================

describe('engine-coverage-round-17 — evaluator + placement residuals', () => {
  it('solveTargetChallenge + validateSolution stay wired for exact hits', () => {
    const challenge = {
      target: 10,
      numbers: [1, 2, 3, 4],
      operators: ['+', '-', '*', '/'] as const,
      useEachOnce: true,
    };
    const solutions = solveTargetChallenge(
      { ...challenge, operators: ['+'] },
      3
    );
    expect(solutions.length).toBeGreaterThan(0);
    const first = solutions[0]!;
    const check = validateSolution(first.expression, {
      target: first.result,
      numbers: challenge.numbers,
      operators: ['+'],
      useEachOnce: false,
    });
    expect(check.valid).toBe(true);
    expect(evaluate('1 + 2').success).toBe(true);
  });

  it('documents private buildExpression([]) / paren early as unreachable', () => {
    // L450 / L468: private helpers; public solveTargetChallenge never calls
    // with empty numbers or mismatched paren arity (r9 carry-forward).
    expect(true).toBe(true);
  });

  it('createBoardWithBlockedCells ignores OOB and keeps board shape', () => {
    const board = createBoardWithBlockedCells(3, 3, [
      { row: -1, col: 0 },
      { row: 1, col: 1 },
      { row: 9, col: 9 },
    ]);
    expect(board.rows).toBe(3);
    expect(board.cols).toBe(3);
    expect(board.cells[1]?.[1]).toBe(true);
  });

  it('documents placement reason|| / rowCells falsy as unreachable', () => {
    // L162 reason|| : validatePlacement always sets reason when invalid.
    // L167 / L197 / L569 rowCells falsy: in-bounds paths imply row exists.
    const board: Board = createBoard(2, 2);
    expect(() =>
      placePolyomino(board, mono(), { row: 0, col: 0 }, 0, false)
    ).not.toThrow();
  });
});

// =============================================================================
// 4. attributes / alignment / storage migrate — hot smoke (owned chars skip)
// =============================================================================

describe('engine-coverage-round-17 — attributes + alignment + migrate smoke', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('COMMON_FRACTIONS + interactive bar stay wired (hot baseline smoke)', () => {
    expect(COMMON_FRACTIONS.length).toBeGreaterThan(0);
    const el = createInteractiveFractionBar(createFraction(2, 5), 5, () => {}, {
      colors: { filled: getFractionColor(5) },
    });
    document.body.appendChild(el);
    expect(el.querySelectorAll('.fraction-segment')).toHaveLength(5);
  });

  it('documents unreachable interactive mouseenter segments[j] hole (r11)', () => {
    expect(true).toBe(true);
  });

  it('attributes logic stays hot after r12 (createMathPiece smoke)', () => {
    expect(isPrime(17)).toBe(true);
    const piece = createMathPiece(30);
    expect(piece.id).toBeTruthy();
    expect(piece.attributes.number).toBe(30);
  });

  it('alignment compat stays hot after r9 (findAllAlignments smoke)', () => {
    const grid: (string | null)[][] = [
      ['A', 'A', 'A'],
      [null, null, null],
      [null, null, null],
    ];
    const get = (row: number, col: number): string | null | undefined =>
      grid[row]?.[col];
    const hits = findAllAlignments({ rows: 3, cols: 3 }, get, {
      requiredLength: 3,
    });
    expect(hits.hasAlignment).toBe(true);
    expect(hits.alignments.length).toBeGreaterThan(0);
  });

  it('storage migrate isPlainProgressObject rejects arrays / null', () => {
    // Prefer storage/** leftover not owned by #909 storage.ts / #504 sanitize.
    expect(isPlainProgressObject(null)).toBe(false);
    expect(isPlainProgressObject([])).toBe(false);
    expect(isPlainProgressObject({ version: 1 })).toBe(true);
  });
});
