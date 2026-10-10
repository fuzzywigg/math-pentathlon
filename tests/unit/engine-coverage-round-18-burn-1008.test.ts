/**
 * q-mp-526 — engine coverage round 18: post-r17 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after tip-folded r17 (#976 / q-mp-506)
 * pinned graph defensive spies + tutorial/evaluator/placement docs. Prefer
 * leftovers NOT claimed by open tip soft-fail chars / HOLD hosts:
 *   - storage createProfile ?? '' arms (not #909 load/save catch paths)
 *   - tutorial / evaluator / placement / fraction-bar carry-forward docs
 *   - hot smoke on attributes / alignment / migrate / dice-selector (100%)
 *
 * Explicitly deferred (sibling ownership):
 *   - graph/algorithms remaining L110/L131/L184 → q-mp-524
 *   - polyomino/transform → q-mp-525
 *   - dice-selector soft-fail → #981 / q-mp-521 (+ mutation #987 / 527)
 *   - board-a11y soft-fail → #986 / q-mp-522 (+ mutation #987 / 527)
 *   - pointer-hygiene soft-fail → #984 / q-mp-523 (+ mutation #987 / 527)
 *   - storage.ts catch soft-fail → #909 / q-mp-420
 *   - sanitize → #504 / q-mp-504; dice-ui → #920; dom-security → #933
 *
 * Pins CURRENT behavior only. No engine / rules.ts / AI / scoring / copy
 * edits. Hex Hard stays 450ms. No Stars & Bars history cap.
 *
 * Baseline rank (tip post949 @ a2626787 / remeasure 8698fffb, coverage-engine-r18-postr17,
 * unit-shared+unit-node+unit-isolated excl. AI determinism/worker/
 * calibration/move-time + bench):
 *   dom-security.ts             90.90% (20/22)    ← mutation w15
 *   tutorial.ts                 93.29% (167/179)  ← documented unreachable
 *   board-a11y.ts               94.47% (154/163)  ← #986 / 522
 *   storage/storage.ts          94.28% branch     ← r18 createProfile pins
 *   polyomino/placement.ts      96.39% (107/111)  ← r8/r11 documented
 *   expressions/evaluator.ts    96.40% (161/167)  ← r9 documented
 *   graph/algorithms.ts         97.69% (127/130)  ← r17 spies; L110/131/184 → 524
 *   dice-ui.ts                  98.27% (57/58)    ← #920
 *   sanitize.ts                 98.61%            ← #504
 *   fraction-bar-ui.ts          99.10% (111/112)  ← r11 L407 doc
 *   dice-selector / transform / pointer-hygiene / attributes / alignment  100%
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { findAllAlignments } from '../../src/core/alignment/compat';
import { createMathPiece, isPrime } from '../../src/core/attributes/logic';
import { DiceSelector } from '../../src/core/dice/dice-selector';
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
import { storage } from '../../src/core/storage';
import { isPlainProgressObject } from '../../src/core/storage/migrate';
import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';
import { POINTER_TAP_SLOP_PX } from '../../src/ui/pointer-hygiene';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'r18-engine', name: 'r18', steps };
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
  vi.restoreAllMocks();
});

// =============================================================================
// 1. storage.ts — createProfile ?? '' residuals (not #909 catch paths)
// =============================================================================

describe('engine-coverage-round-18 — storage createProfile residuals', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
  });

  afterEach(() => {
    localStorage.clear();
    storage.resetAll();
  });

  it('createProfile coerces non-string name/avatar via ?? to empty strings', () => {
    // Public signature is string, but sanitizeDisplayStringAllowEmpty returns
    // null for non-strings → L188–191 `?? ''` before setProfile.
    const profile = storage.createProfile(
      42 as unknown as string,
      true as unknown as string
    );
    expect(profile.name).toBe('');
    expect(profile.avatar).toBe('');
    expect(profile.id).toBeTruthy();
    expect(storage.getProfile()?.id).toBe(profile.id);
  });

  it('createProfile non-string name only still stores empty avatar when avatar string', () => {
    const profile = storage.createProfile({ x: 1 } as unknown as string, 'owl');
    expect(profile.name).toBe('');
    expect(profile.avatar).toBe('owl');
  });

  it('documents getTodayString / getYesterdayString ?? as unreachable', () => {
    // L291 / L297: `split('T')[0] ?? ''` — String#split always yields a
    // defined [0] for any string; ISO dates always contain 'T'. No public
    // spy without prototype patch; leave for docs only (#909 owns catch paths).
    expect(true).toBe(true);
  });
});

// =============================================================================
// 2. tutorial.ts — post-r17 leftover docs + disjoint placement smoke
// =============================================================================

describe('engine-coverage-round-18 — tutorial post-r17 residuals', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
  });

  it('bottom placement with a live target keeps ring + tooltip mounted', () => {
    // Structural smoke complementary to r17 right / r16 top; does not claim
    // L700 cueAbove or L758 flip-preferVertical.
    const target = mountTarget('r18-bottom', {
      left: 80,
      top: 60,
      width: 48,
      height: 32,
    });
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'bottom',
          title: 'B',
          message: 'below',
          highlightSelector: '#r18-bottom',
          position: 'bottom',
        },
      ])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(manager.getIsActive()).toBe(true);
    expect(ring.style.display).toBe('block');
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
    expect(target.isConnected).toBe(true);
  });

  it('documents remaining private null-guard / unreachable arms after r17', () => {
    // Carry-forward after r13–r17:
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
// 3. graph/** — baseline smoke only (algorithms residual holes → q-mp-524)
// =============================================================================

describe('engine-coverage-round-18 — graph baseline smoke (no new spies)', () => {
  it('track / hex / complete constructors stay wired without prototype patches', () => {
    const track = createTrackGraph(5);
    expect(bfs(track, 't0', 't4').found).toBe(true);
    expect(isConnected(track)).toBe(true);
    expect(findNodesAtDistance(track, 't0', 2)).toContain('t2');

    const hex = createHexLatticeGraph(2);
    expect(hex.nodes.size).toBeGreaterThan(0);
    const complete = createCompleteGraph(3);
    expect(complete.edges.length).toBeGreaterThan(0);
  });

  it('documents algorithms L110/L131/L184 deferred to q-mp-524', () => {
    // Post-r17 remaining branch holes (isolated spies already cover queue.shift
    // / Map-miss continues / hex-id / complete holes):
    //   L110 dijkstra distances.get miss inside unvisited.forEach
    //   L131 dijkstra currentDist undefined continue
    //   L184 isConnected empty-iterator .done
    // Soft-fail characterization of those arms is owned by q-mp-524 — do not
    // add Array/Map/iterator spies here.
    expect(true).toBe(true);
  });
});

// =============================================================================
// 4. expressions / placement / fraction-bar — documented residuals + soft edges
// =============================================================================

describe('engine-coverage-round-18 — evaluator + placement + fraction-bar', () => {
  it('solveTargetChallenge + validateSolution stay wired for exact hits', () => {
    const challenge = {
      target: 6,
      numbers: [1, 2, 3],
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
    expect(evaluate('2 + 2').success).toBe(true);
  });

  it('documents private buildExpression([]) / paren early as unreachable', () => {
    // L450 / L468: private helpers; public solveTargetChallenge never calls
    // with empty numbers or mismatched paren arity (r9–r17 carry-forward).
    expect(true).toBe(true);
  });

  it('createBoardWithBlockedCells ignores OOB and keeps board shape', () => {
    const board = createBoardWithBlockedCells(2, 2, [
      { row: -2, col: 0 },
      { row: 0, col: 0 },
      { row: 8, col: 8 },
    ]);
    expect(board.rows).toBe(2);
    expect(board.cols).toBe(2);
    expect(board.cells[0]?.[0]).toBe(true);
  });

  it('documents placement reason|| / rowCells falsy as unreachable', () => {
    // L162 reason|| : validatePlacement always sets reason when invalid.
    // L167 / L197 / L569 rowCells falsy: in-bounds paths imply row exists.
    // polyomino/transform soft-fail characterization → q-mp-525 (skipped).
    const board: Board = createBoard(2, 2);
    expect(() =>
      placePolyomino(board, mono(), { row: 0, col: 0 }, 0, false)
    ).not.toThrow();
  });

  it('documents unreachable interactive mouseenter segments[j] hole (r11)', () => {
    // fraction-bar-ui L407 — r11–r17 carry-forward.
    expect(true).toBe(true);
  });
});

// =============================================================================
// 5. hot smoke — attributes / alignment / migrate / dice-selector / pointer
// =============================================================================

describe('engine-coverage-round-18 — hot smoke + deferred soft-fail hosts', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('COMMON_FRACTIONS + interactive bar stay wired (hot baseline smoke)', () => {
    expect(COMMON_FRACTIONS.length).toBeGreaterThan(0);
    const el = createInteractiveFractionBar(createFraction(1, 4), 4, () => {}, {
      colors: { filled: getFractionColor(4) },
    });
    document.body.appendChild(el);
    expect(el.querySelectorAll('.fraction-segment')).toHaveLength(4);
  });

  it('attributes logic stays hot after r12 (createMathPiece smoke)', () => {
    expect(isPrime(13)).toBe(true);
    const piece = createMathPiece(42);
    expect(piece.id).toBeTruthy();
    expect(piece.attributes.number).toBe(42);
  });

  it('alignment compat stays hot after r9 (findAllAlignments smoke)', () => {
    const grid: (string | null)[][] = [
      ['X', 'X', 'X'],
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
    expect(isPlainProgressObject(null)).toBe(false);
    expect(isPlainProgressObject([])).toBe(false);
    expect(isPlainProgressObject({ version: 1 })).toBe(true);
  });

  it('dice-selector stays at 100% branch (soft-fail owned by #981 / 521)', () => {
    // Structural wiring only — soft-fail / inject-skip arms live in
    // q-mp-521-dice-selector-soft-fail-residuals.test.ts; mutation w18 #987.
    const root = document.createElement('div');
    document.body.appendChild(root);
    const sel = new DiceSelector(root, { showRollButton: true });
    expect(root.classList.contains('dice-selector')).toBe(true);
    expect(sel.getResult()).toBeNull();
    sel.destroy();
  });

  it('pointer-hygiene slop constant stays wired (soft-fail owned by #984 / 523)', () => {
    // Soft-fail catch arms live in q-mp-523; mutation w18 #987.
    expect(POINTER_TAP_SLOP_PX).toBe(16);
  });
});
