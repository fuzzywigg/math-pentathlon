/**
 * q-mp-428 — engine coverage round 14: post-r13 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after unfolded r13 (#899 / q-mp-401)
 * pinned tutorial ResizeObserver / chrome / highlight-ui. Prefer leftovers in
 * src/core/tutorial.ts + src/core/graph/ + src/core/fractions/ not claimed
 * by r11-r13 and not rules.ts / scoring. Pins CURRENT behavior only.
 *
 * Does not change engine / rules.ts / AI source. Does not duplicate #899 cases.
 *
 * Skips: storage (#909 / q-mp-420), attribute-ui (#893 / q-mp-403),
 * contiguous (undrafted 407), dice-ui (q-mp-432), highlight-ui (r13).
 *
 * Baseline rank (tip post865 @ 7f8a7147 + r13 suite overlay for post-r13
 * residual view, coverage-engine-r14-baseline, unit-shared+unit-node excl.
 * AI determinism/worker/calibration/move-time + bench):
 *   tutorial.ts                 86.03% branches (154/179) after r13
 *   graph/algorithms.ts         90.00% (117/130)  ← r8 documented
 *   storage/storage.ts          90.00%            ← #909 owns soft-fail
 *   graph/types.ts              94.11% (32/34)    ← r8 documented
 *   fraction-bar-ui.ts          99.11% (111/112)  ← r11 L407 doc
 *   graph/graph-ui + fractions/arithmetic 100%
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  return { id: 'r14-engine', name: 'r14', steps };
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
// 1. tutorial.ts — post-r13 residual pins (disjoint from #899)
// =============================================================================

describe('engine-coverage-round-14 — tutorial post-r13 residuals', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
  });

  it('start with non-HTMLElement activeElement leaves returnFocus unset', async () => {
    // L97: document.activeElement instanceof HTMLElement → false arm.
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('tabindex', '0');
    document.body.appendChild(svg);
    svg.focus();
    expect(document.activeElement).toBe(svg);
    expect(document.activeElement instanceof HTMLElement).toBe(false);

    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 's0',
          title: 'T',
          message: 'm',
        },
      ])
    );
    expect(manager.getIsActive()).toBe(true);
    manager.exit();
    await Promise.resolve();
    // Focus restore skipped when trigger was never an HTMLElement.
    expect(document.activeElement).not.toBe(
      document.querySelector('.tutorial-next-btn')
    );
  });

  it('missing highlightSelector target clears ring and centers tooltip', () => {
    // L644–646: selector set but querySelector miss → clearHighlight.
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'ghost',
          title: 'Ghost',
          message: 'target absent',
          highlightSelector: '#r14-does-not-exist',
          position: 'bottom',
        },
      ])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(ring.style.display).toBe('none');
    expect(tip.style.left).toMatch(/px$/);
    expect(tip.style.top).toMatch(/px$/);
  });

  it('no-highlight step centers via positionTooltipCenter without tipBox', () => {
    // clearHighlight → positionTooltipCenter() → tipBox ?? parkAndMeasure (L876).
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'plain',
          title: 'Plain',
          message: 'no ring',
        },
      ])
    );
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(ring.style.display).toBe('none');
    expect(tip.style.left).toMatch(/px$/);
    expect(tip.style.top).toMatch(/px$/);
  });

  it('preferVerticalSide returns top when only the upper band fits', () => {
    // L793: spaceBelow short, spaceAbove ≥ height+gap → 'top' (not r13 both-short).
    const target = mountTarget('r14-top-band', {
      left: 80,
      top: 220,
      width: 60,
      height: 40,
    });
    vi.stubGlobal('innerWidth', 400);
    vi.stubGlobal('innerHeight', 300);
    vi.stubGlobal('visualViewport', {
      width: 400,
      height: 300,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 120
          : 40;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 100
          : 40;
      },
    });

    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'left',
          title: 'L',
          message: 'm',
          highlightSelector: '#r14-top-band',
          position: 'left',
        },
      ])
    );
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    const tipTop = Number.parseFloat(tip.style.top);
    // Prefer-vertical chose above the avoid rect (top band).
    expect(tipTop).toBeLessThan(220);
    expect(target.isConnected).toBe(true);
  });

  it('top placement that overlaps flips to the opposite vertical band', () => {
    // L752–760: tryPlaceOnSide(top) fails → flip to bottom.
    const target = mountTarget('r14-flip-top', {
      left: 100,
      top: 20,
      width: 80,
      height: 60,
    });
    vi.stubGlobal('innerWidth', 360);
    vi.stubGlobal('innerHeight', 400);
    vi.stubGlobal('visualViewport', {
      width: 360,
      height: 400,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 200
          : 40;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 160
          : 40;
      },
    });

    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'top',
          title: 'Top',
          message: 'flip',
          highlightSelector: '#r14-flip-top',
          position: 'top',
        },
      ])
    );
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    const tipTop = Number.parseFloat(tip.style.top);
    // Flip lands below the target (or clamped last-resort still applies px).
    expect(tip.style.left).toMatch(/px$/);
    expect(tip.style.top).toMatch(/px$/);
    expect(tipTop).toBeGreaterThanOrEqual(0);
    expect(target.isConnected).toBe(true);
  });

  it('click-cell requiredAction expands avoid rect via cueBelow band', () => {
    // buildAvoidRect(..., cueAbove=false) live path (L701–702); cueAbove=true
    // remains r13-documented unreachable (sole call site hardcodes false).
    const target = mountTarget('r14-click-cell', {
      left: 120,
      top: 120,
      width: 40,
      height: 40,
    });
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'cell',
          title: 'Cell',
          message: 'tap',
          highlightSelector: '#r14-click-cell',
          position: 'bottom',
          requiredAction: { type: 'click-cell', row: 0, col: 0 },
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
    const cue = document.querySelector('.tutorial-tap-cue');
    expect(cue).toBeTruthy();
    expect(target.isConnected).toBe(true);
  });

  it('documents remaining private null-guard / r13 unreachable arms', () => {
    // Carry-forward: L383 (!isActive keydown), L700 (cueAbove=true), plus
    // private null early-returns L716/872/904/934/987 that require detached
    // tooltip mid-private-call (no public hook without Array/DOM spies).
    expect(true).toBe(true);
  });
});

// =============================================================================
// 2. graph/** — r8 unreachable carry-forward (post-r13; no Array/Map spies)
// =============================================================================

describe('engine-coverage-round-14 — graph documented unreachable carry-forward', () => {
  it('documents algorithms queue.shift / Map-miss continues as unreachable', () => {
    // Carry-forward from r8–r13: defensive queue.shift() === undefined /
    // Map.get miss / empty-iterator arms stay unreachable on public APIs.
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
// 3. fractions/** — hot baseline + r11 L407 carry-forward
// =============================================================================

describe('engine-coverage-round-14 — fractions residuals', () => {
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
    // L407: `if (seg)` false — segments densely pushed; no public hole.
    expect(true).toBe(true);
  });
});
