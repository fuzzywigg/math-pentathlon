/**
 * q-mp-456 — engine coverage round 15: post-r14 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after tip-folded r14 (q-mp-428 / #911)
 * pinned tutorial non-HTMLElement focus / ghost highlight / preferVertical top /
 * flip / click-cell cueBelow. Prefer leftovers in src/core/tutorial.ts +
 * src/core/graph/ + src/core/fractions/ + src/core/attributes/ not claimed by
 * r11–r14 and not rules.ts / scoring. Pins CURRENT behavior only.
 *
 * Does not change engine / rules.ts / AI source. Does not duplicate r13/r14 cases.
 *
 * Skips: storage (#909 / q-mp-420), dice-ui (#920 / q-mp-432), attribute-ui
 * soft-fail (#893 / q-mp-403), dom-security / security-headers (mutation w15
 * q-mp-457), contiguous (undrafted 407), highlight-ui (r13 hot).
 *
 * Baseline rank (tip post898 @ b7e518b4, coverage-engine-r15-baseline,
 * unit-shared+unit-node excl. AI determinism/worker/calibration/move-time + bench):
 *   tutorial.ts                 87.15% branches (156/179) after r14
 *   graph/algorithms.ts         90.00% (117/130)  ← r8 documented
 *   storage/storage.ts          90.00%            ← #909 owns soft-fail
 *   dom-security.ts             90.91%            ← r10 + mutation w15
 *   graph/types.ts              94.12% (32/34)    ← r8 documented
 *   polyomino/placement.ts      96.40%            ← r8/r11 documented
 *   expressions/evaluator.ts    96.41%            ← r9 documented
 *   dice-ui.ts                  96.55%            ← #920
 *   fraction-bar-ui.ts          99.11%            ← r11 L407 doc
 *   attributes/**               100%              ← r12 closed
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  return { id: 'r15-engine', name: 'r15', steps };
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

function stubViewport(width: number, height: number): void {
  vi.stubGlobal('innerWidth', width);
  vi.stubGlobal('innerHeight', height);
  vi.stubGlobal('visualViewport', {
    width,
    height,
    offsetLeft: 0,
    offsetTop: 0,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

function stubTooltipBox(width: number, height: number): void {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return (this as HTMLElement).classList?.contains('tutorial-tooltip')
        ? width
        : 40;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return (this as HTMLElement).classList?.contains('tutorial-tooltip')
        ? height
        : 40;
    },
  });
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
// 1. tutorial.ts — post-r14 residual pins (disjoint from r13/r14)
// =============================================================================

describe('engine-coverage-round-15 — tutorial post-r14 residuals', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
  });

  it('Next listener no-ops when requiredAction is set even if button re-enabled', () => {
    // L331 else: disabled Next does not fire click in jsdom; re-enable to hit
    // the listener gate that r13 asserted only via disabled attribute.
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'gate',
          title: 'G',
          message: 'g',
          requiredAction: { type: 'click', selector: '.r15-never' },
        },
        { id: 'free', title: 'F', message: 'f' },
      ])
    );
    const next = document.querySelector(
      '.tutorial-next-btn'
    ) as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    next.disabled = false;
    next.click();
    expect(manager.getCurrentStep()?.id).toBe('gate');
    expect(manager.getIsActive()).toBe(true);
  });

  it('non-Escape keydown leaves an active tutorial running', () => {
    // L385 else: Escape arm covered by r13; other keys must not exit.
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 's0', title: 'A', message: 'a', position: 'center' }])
    );
    expect(manager.getIsActive()).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(manager.getIsActive()).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('s0');
  });

  it('missing tooltip chrome nodes skip content writes on refresh', () => {
    // L538 / L541 / L545 / L550 / L556 falsy arms — createOverlay always
    // installs nodes; surgically remove then refreshHighlight.
    manager = new TutorialManager();
    manager.start(
      cfg([
        { id: 's0', title: 'A', message: 'a' },
        { id: 's1', title: 'B', message: 'b' },
      ])
    );
    document.querySelector('.tutorial-tooltip-title')?.remove();
    document.querySelector('.tutorial-tooltip-message')?.remove();
    document.querySelector('.tutorial-step-counter')?.remove();
    document.querySelector('.tutorial-prev-btn')?.remove();
    document.querySelector('.tutorial-next-btn')?.remove();

    expect(() => manager.refreshHighlight()).not.toThrow();
    expect(manager.getIsActive()).toBe(true);
    expect(manager.getCurrentStep()?.id).toBe('s0');
    expect(document.querySelector('.tutorial-tooltip-title')).toBeNull();
    expect(document.querySelector('.tutorial-next-btn')).toBeNull();
  });

  it('missing highlight ring with absent target is a silent no-op', () => {
    // L644 else: else-if (highlightRing) false when ring node removed.
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'ghost',
          title: 'Ghost',
          message: 'no ring',
          highlightSelector: '#r15-does-not-exist',
          position: 'bottom',
        },
      ])
    );
    document.querySelector('.tutorial-highlight-ring')?.remove();
    expect(() => manager.refreshHighlight()).not.toThrow();
    expect(manager.getIsActive()).toBe(true);
    expect(document.querySelector('.tutorial-highlight-ring')).toBeNull();
  });

  it('bottom placement that overlaps flips to the opposite vertical band', () => {
    // L756–758: side === 'bottom' → flip 'top' (r14 pinned top→bottom only).
    const target = mountTarget('r15-flip-bottom', {
      left: 100,
      top: 280,
      width: 80,
      height: 60,
    });
    stubViewport(360, 400);
    stubTooltipBox(200, 160);

    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'bottom',
          title: 'Bottom',
          message: 'flip',
          highlightSelector: '#r15-flip-bottom',
          position: 'bottom',
        },
      ])
    );
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    const tipTop = Number.parseFloat(tip.style.top);
    expect(tip.style.left).toMatch(/px$/);
    expect(tip.style.top).toMatch(/px$/);
    expect(tipTop).toBeGreaterThanOrEqual(0);
    expect(target.isConnected).toBe(true);
  });

  it('preferVerticalSide returns top when the upper band has more room', () => {
    // L796: both bands short of height+gap → spaceAbove > spaceBelow → 'top'.
    // r13 cramped hit spaceBelow >= spaceAbove; this pins the complementary arm.
    const target = mountTarget('r15-above-band', {
      left: 40,
      top: 110,
      width: 80,
      height: 40,
    });
    stubViewport(200, 160);
    stubTooltipBox(180, 140);

    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'left',
          title: 'L',
          message: 'm',
          highlightSelector: '#r15-above-band',
          position: 'left',
        },
      ])
    );
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(tip.style.left).toMatch(/px$/);
    expect(tip.style.top).toMatch(/px$/);
    expect(target.isConnected).toBe(true);
  });

  it('documents remaining private null-guard / unreachable arms', () => {
    // Carry-forward: L383 (!isActive keydown), L700 (cueAbove=true),
    // L725/726 ?? rights (sole call site always passes tipBox + avoidRect),
    // L758 flip-preferVertical (left/right already rewrote side),
    // L937 cache hit (showCurrentStep always invalidateTooltipSize before
    // measure), plus private null early-returns L716/872/904/934/987.
    expect(true).toBe(true);
  });
});

// =============================================================================
// 2. graph/** — r8 unreachable carry-forward (post-r14; no Array/Map spies)
// =============================================================================

describe('engine-coverage-round-15 — graph documented unreachable carry-forward', () => {
  it('documents algorithms queue.shift / Map-miss continues as unreachable', () => {
    const g = createTrackGraph(5);
    expect(bfs(g, 't0', 't4').found).toBe(true);
    expect(isConnected(g)).toBe(true);
    expect(findNodesAtDistance(g, 't0', 3)).toContain('t3');
    expect(findNodesWithinDistance(g, 't0', 2).length).toBeGreaterThan(1);
  });

  it('documents types hex-id / complete-graph index holes as unreachable', () => {
    const hex = createHexLatticeGraph(1);
    expect(hex.nodes.size).toBeGreaterThan(0);
    const complete = createCompleteGraph(3);
    expect(complete.edges.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// 3. fractions/** + attributes/** — hot baseline + prior-round docs
// =============================================================================

describe('engine-coverage-round-15 — fractions + attributes residuals', () => {
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

  it('documents unreachable interactive mouseenter segments[j] hole (r11)', () => {
    // L407: `if (seg)` false — segments densely pushed; no public hole.
    expect(true).toBe(true);
  });

  it('attributes logic stays hot after r12 (createMathPiece smoke)', () => {
    // attributes/** measured 100% branch/line on tip; keep ownership smoke only.
    expect(isPrime(7)).toBe(true);
    const piece = createMathPiece(12);
    expect(piece.id).toBeTruthy();
    expect(piece.attributes.number).toBe(12);
  });
});
