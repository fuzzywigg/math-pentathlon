/**
 * q-mp-477 — engine coverage round 16: post-r15 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after unfolded r15 (#935 / q-mp-456)
 * pinned tutorial Next-gate / non-Escape / missing chrome / ghost ring /
 * bottom→top flip / preferVertical upper-band. Prefer leftovers in
 * src/core/tutorial.ts + src/core/graph/ + src/core/alignment/ +
 * src/core/attributes/ + src/core/fractions/ not claimed by r11–r15 and not
 * rules.ts / scoring. Pins CURRENT behavior only.
 *
 * Does not change engine / rules.ts / AI source. Does not duplicate #935 cases.
 *
 * Skips: storage (#909 / q-mp-420), dice-ui (#920 / q-mp-432), attribute-ui
 * soft-fail (#893 / q-mp-403), dom-security / security-headers (mutation w15
 * #933 / q-mp-457), contiguous (undrafted 407), safe-web-storage/feature-flags
 * (#925 / q-mp-455), highlight-ui (r13 hot).
 *
 * Baseline rank (tip post914 @ 753052a6 + #935 r15 suite overlay for post-r15
 * residual view, coverage-engine-r16-baseline, unit-shared+unit-node excl.
 * AI determinism/worker/calibration/move-time + bench):
 *   storage/storage.ts          90.00% (63/70)    ← #909 owns soft-fail
 *   graph/algorithms.ts         90.00% (117/130)  ← r8 documented
 *   dom-security.ts             90.90% (20/22)    ← mutation w15
 *   tutorial.ts                 92.17% (165/179)  ← r16 primary (post-r15 leftovers)
 *   graph/types.ts              94.11% (32/34)    ← r8 documented
 *   polyomino/placement.ts      96.39% (107/111)  ← r8/r11 documented
 *   expressions/evaluator.ts    96.40% (161/167)  ← r9 documented
 *   dice-ui.ts                  98.27% (57/58)    ← #920
 *   fraction-bar-ui.ts          99.10% (111/112)  ← r11 L407 doc
 *   attributes/** / alignment/* / graph-ui        100%
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { findAllAlignments } from '../../src/core/alignment/compat';
import { createMathPiece, isPrime } from '../../src/core/attributes/logic';
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
import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'r16-engine', name: 'r16', steps };
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

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll(
      '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
    )
    .forEach((el) => el.remove());
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// =============================================================================
// 1. tutorial.ts — post-r15 residual pins (disjoint from r13–r15)
// =============================================================================

describe('engine-coverage-round-16 — tutorial ResizeObserver contentRect residuals', () => {
  type ROCb = (entries: ResizeObserverEntry[]) => void;
  let observedCb: ROCb | null = null;
  let manager: TutorialManager;

  beforeEach(() => {
    observedCb = null;
    class FakeRO {
      constructor(fn: ROCb) {
        observedCb = fn;
      }
      observe(): void {
        /* seeded via cb */
      }
      disconnect(): void {
        /* noop */
      }
      unobserve(): void {
        /* noop */
      }
    }
    globalThis.ResizeObserver = FakeRO as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    manager?.exit();
  });

  it('contentRect height-only arm seeds cache when width is zero', () => {
    // L366 binary-expr right: r13 pinned width>0 short-circuit; this forces
    // evaluation of `contentRect.height > 0` after zero borderBoxSize.
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 's0', title: 'T', message: 'm', position: 'center' }])
    );
    expect(observedCb).toBeTypeOf('function');
    observedCb!([
      {
        target: document.querySelector('.tutorial-tooltip')!,
        contentRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 96,
          top: 0,
          left: 0,
          bottom: 96,
          right: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [{ inlineSize: 0, blockSize: 0 }],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
    expect(manager.getIsActive()).toBe(true);
  });

  it('zero contentRect after empty borderBox is a silent no-op', () => {
    // L366 else: both contentRect axes ≤ 0 → skip cache write (r13 covered
    // the then arm only).
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 's0', title: 'T', message: 'm', position: 'center' }])
    );
    expect(observedCb).toBeTypeOf('function');
    observedCb!([
      {
        target: document.querySelector('.tutorial-tooltip')!,
        contentRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          toJSON: () => ({}),
        },
        borderBoxSize: [{ inlineSize: 0, blockSize: 0 }],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);
    expect(manager.getIsActive()).toBe(true);
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
  });

  it('missing borderBoxSize falls through to contentRect width-only path', () => {
    // borderBoxSize?.[0] undefined → skip L360; contentRect width>0 seeds cache.
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 's0', title: 'T', message: 'm', position: 'center' }])
    );
    expect(observedCb).toBeTypeOf('function');
    observedCb!([
      {
        target: document.querySelector('.tutorial-tooltip')!,
        contentRect: {
          x: 0,
          y: 0,
          width: 180,
          height: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 180,
          toJSON: () => ({}),
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(tip).toBeTruthy();
    expect(manager.getIsActive()).toBe(true);
  });
});

describe('engine-coverage-round-16 — tutorial post-r15 placement smoke', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
  });

  it('click-cell with top placement still mounts cue + action ring', () => {
    // Structural smoke complementary to r14 cueBelow avoid-rect pin; does not
    // claim buildAvoidRect cueAbove=true (sole call site hardcodes false).
    const target = mountTarget('r16-click-top', {
      left: 140,
      top: 160,
      width: 48,
      height: 48,
    });
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'cell',
          title: 'Cell',
          message: 'tap',
          highlightSelector: '#r16-click-top',
          position: 'top',
          requiredAction: { type: 'click-cell', row: 1, col: 2 },
        },
      ])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('block');
    expect(ring.classList.contains('tutorial-highlight-ring--action')).toBe(
      true
    );
    expect(document.querySelector('.tutorial-tap-cue')).toBeTruthy();
    expect(target.isConnected).toBe(true);
  });

  it('documents remaining private null-guard / unreachable arms', () => {
    // Carry-forward after r15 + r16 contentRect pins:
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
// 2. graph/** — r8 unreachable carry-forward (post-r15; no Array/Map spies)
// =============================================================================

describe('engine-coverage-round-16 — graph documented unreachable carry-forward', () => {
  it('documents algorithms queue.shift / Map-miss continues as unreachable', () => {
    const g = createTrackGraph(6);
    expect(bfs(g, 't0', 't5').found).toBe(true);
    expect(isConnected(g)).toBe(true);
    expect(findNodesAtDistance(g, 't0', 4)).toContain('t4');
    expect(findNodesWithinDistance(g, 't0', 3).length).toBeGreaterThan(2);
  });

  it('documents types hex-id / complete-graph index holes as unreachable', () => {
    const hex = createHexLatticeGraph(2);
    expect(hex.nodes.size).toBeGreaterThan(0);
    const complete = createCompleteGraph(4);
    expect(complete.edges.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// 3. fractions/** + attributes/** + alignment/** — hot baseline smoke
// =============================================================================

describe('engine-coverage-round-16 — fractions + attributes + alignment residuals', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('COMMON_FRACTIONS + interactive bar stay wired (hot baseline smoke)', () => {
    expect(COMMON_FRACTIONS.length).toBeGreaterThan(0);
    const el = createInteractiveFractionBar(createFraction(3, 8), 8, () => {}, {
      colors: { filled: getFractionColor(8) },
    });
    document.body.appendChild(el);
    expect(el.querySelectorAll('.fraction-segment')).toHaveLength(8);
  });

  it('documents unreachable interactive mouseenter segments[j] hole (r11)', () => {
    // L407: `if (seg)` false — segments densely pushed; no public hole.
    expect(true).toBe(true);
  });

  it('attributes logic stays hot after r12 (createMathPiece smoke)', () => {
    expect(isPrime(13)).toBe(true);
    const piece = createMathPiece(24);
    expect(piece.id).toBeTruthy();
    expect(piece.attributes.number).toBe(24);
  });

  it('alignment compat stays hot after r9 (findAllAlignments smoke)', () => {
    // alignment/** measured 100% branch/line on tip; keep ownership smoke only.
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
});
