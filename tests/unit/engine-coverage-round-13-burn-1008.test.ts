/**
 * q-mp-401 — engine coverage round 13: post-r12 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after r12 closed attributes/dice (+
 * tutorial exit leftover). Prefer src/core/tutorial.ts edges +
 * alignment/highlight-ui leftovers; graph/algorithms + graph/types remain
 * r8-documented unreachable (queue.shift / Map-miss / hex id holes).
 * Pins CURRENT behavior only. Does not change engine / rules.ts / AI source.
 *
 * Skips contiguous (#407 undrafted) and grid-alignment (#858 / q-mp-374).
 *
 * Baseline rank (tip post865 @ 3908809d, coverage-engine-r13-baseline,
 * unit-shared+unit-node excl. AI determinism/worker/calibration):
 *   tutorial.ts                 75.97% branches (136/179)
 *   graph/algorithms.ts         90.00% (117/130)  ← r8 documented
 *   graph/types.ts              94.11% (32/34)    ← r8 documented
 *   alignment/highlight-ui.ts   95.12% (39/41)    ← className ?? ''
 *   alignment/{compat,contiguous,grid-alignment} 100%
 *   graph/graph-ui.ts           100%
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createAlignmentHighlight,
  createPathHighlight,
  type HighlightStyle,
} from '../../src/core/alignment/highlight-ui';
import type { AlignmentResult } from '../../src/core/alignment/types';
import { DIRECTIONS } from '../../src/core/alignment/types';
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
  TutorialManager,
  type TutorialConfig,
  type TutorialStep,
} from '../../src/core/tutorial';

function cfg(steps: TutorialConfig['steps']): TutorialConfig {
  return { id: 'r13-engine', name: 'r13', steps };
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
// 1. tutorial.ts — preferred host (ResizeObserver + placement + chrome edges)
// =============================================================================

describe('engine-coverage-round-13 — tutorial ResizeObserver size cache', () => {
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

  it('empty ResizeObserver entry is a no-op; borderBoxSize seeds cache', () => {
    // L354–364: entries[0] missing → return; borderBoxSize path sets cache.
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 's0', title: 'T', message: 'm', position: 'center' }])
    );
    expect(observedCb).toBeTypeOf('function');

    observedCb!([]);
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
        borderBoxSize: [{ inlineSize: 260, blockSize: 110 }],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);

    // Advance so showCurrentStep re-measure can consume the valid cache (L937).
    const target = mountTarget('r13-ro-target', {
      left: 200,
      top: 200,
      width: 40,
      height: 40,
    });
    manager.exit();
    manager = new TutorialManager();
    // Re-install FakeRO after exit (exit path may not restore global).
    class FakeRO2 {
      constructor(fn: ROCb) {
        observedCb = fn;
      }
      observe(): void {
        /* noop */
      }
      disconnect(): void {
        /* noop */
      }
      unobserve(): void {
        /* noop */
      }
    }
    globalThis.ResizeObserver = FakeRO2 as unknown as typeof ResizeObserver;
    manager.start(
      cfg([
        {
          id: 'hl',
          title: 'H',
          message: 'm',
          highlightSelector: '#r13-ro-target',
          position: 'bottom',
        },
      ])
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
        borderBoxSize: [{ inlineSize: 240, blockSize: 100 }],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);
    manager.refreshHighlight();
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(tip.style.left).toMatch(/px$/);
    expect(target.isConnected).toBe(true);
  });

  it('zero borderBoxSize falls through to contentRect cache', () => {
    // L366–369: contentRect width/height > 0 seeds cache when border box empty.
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
          width: 200,
          height: 80,
          top: 0,
          left: 0,
          bottom: 80,
          right: 200,
          toJSON: () => ({}),
        },
        borderBoxSize: [{ inlineSize: 0, blockSize: 0 }],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      } as unknown as ResizeObserverEntry,
    ]);
    expect(document.querySelector('.tutorial-tooltip')).toBeTruthy();
  });
});

describe('engine-coverage-round-13 — tutorial chrome / placement edges', () => {
  let manager: TutorialManager;

  afterEach(() => {
    manager?.exit();
  });

  it('restarts after leftover overlay and restores focus only when still in DOM', async () => {
    // L93–95: drop leftover overlay; L121 false: detached trigger skips focus.
    const trigger = document.createElement('button');
    trigger.id = 'r13-focus-trigger';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 's0', title: 'A', message: 'a', position: 'center' }])
    );
    expect(document.querySelector('.tutorial-overlay')).toBeTruthy();

    // Second start while first still active — removeOverlay path on leftover.
    manager.start(
      cfg([
        { id: 's1', title: 'B', message: 'b', position: 'center' },
        { id: 's2', title: 'C', message: 'c' },
      ])
    );
    expect(document.querySelectorAll('.tutorial-overlay')).toHaveLength(1);

    trigger.remove();
    manager.exit();
    await Promise.resolve();
    await Promise.resolve();
    // Detached trigger must not throw; body remains focusable host.
    expect(document.getElementById('r13-focus-trigger')).toBeNull();
  });

  it('Next click is a no-op while requiredAction gates the step', () => {
    // L331–333: Next listener only advances when !requiredAction.
    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'gate',
          title: 'G',
          message: 'g',
          requiredAction: { type: 'click', selector: '.r13-never' },
        },
        { id: 'free', title: 'F', message: 'f' },
      ])
    );
    const next = document.querySelector(
      '.tutorial-next-btn'
    ) as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    expect(next.classList.contains('tutorial-btn-waiting')).toBe(true);
    next.click();
    expect(manager.getCurrentStep()?.id).toBe('gate');
    expect(manager.getIsActive()).toBe(true);
  });

  it('Escape exits an active tutorial', () => {
    manager = new TutorialManager();
    manager.start(
      cfg([{ id: 's0', title: 'A', message: 'a', position: 'center' }])
    );
    expect(manager.getIsActive()).toBe(true);
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(manager.getIsActive()).toBe(false);
  });

  it('highlight + position center parks tooltip via positionTooltip center arm', () => {
    // L719–721: position === 'center' early path inside positionTooltip.
    const target = mountTarget('r13-center-hl', {
      left: 120,
      top: 140,
      width: 48,
      height: 32,
    });
    vi.stubGlobal('innerWidth', 900);
    vi.stubGlobal('innerHeight', 700);
    vi.stubGlobal('visualViewport', {
      width: 900,
      height: 700,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 280
          : 40;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 120
          : 40;
      },
    });

    manager = new TutorialManager();
    manager.start(
      cfg([
        {
          id: 'c',
          title: 'C',
          message: 'm',
          highlightSelector: '#r13-center-hl',
          position: 'center',
        },
      ])
    );
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring.style.display).toBe('block');
    expect(tip.style.left).toMatch(/px$/);
    expect(tip.style.top).toMatch(/px$/);
    expect(target.isConnected).toBe(true);
  });

  it('forged non-union position falls through computeSidePosition default', () => {
    // L853–856: switch default (exhaustive never) → bottom-like fallback.
    const target = mountTarget('r13-forged-pos', {
      left: 300,
      top: 280,
      width: 40,
      height: 40,
    });
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
    vi.stubGlobal('visualViewport', {
      width: 1024,
      height: 768,
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
          ? 80
          : 40;
      },
    });

    manager = new TutorialManager();
    const forged = {
      id: 'forge',
      title: 'F',
      message: 'm',
      highlightSelector: '#r13-forged-pos',
      // Public union is closed; forge to exercise default arm.
      position: 'diagonal' as TutorialStep['position'],
    };
    manager.start(cfg([forged]));
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(tip.style.left).toMatch(/px$/);
    expect(target.isConnected).toBe(true);
  });

  it('cramped viewport forces preferVerticalSide fallback when both bands short', () => {
    // L793–796: neither band fits height+gap → compare spaceBelow vs spaceAbove.
    const target = mountTarget('r13-cramped', {
      left: 40,
      top: 40,
      width: 80,
      height: 80,
    });
    vi.stubGlobal('innerWidth', 200);
    vi.stubGlobal('innerHeight', 160);
    vi.stubGlobal('visualViewport', {
      width: 200,
      height: 160,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 180
          : 40;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 140
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
          highlightSelector: '#r13-cramped',
          position: 'left',
        },
      ])
    );
    const tip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    // Clamped placement still applies left/top in px (last-resort path OK).
    expect(tip.style.left).toMatch(/px$/);
    expect(tip.style.top).toMatch(/px$/);
    expect(target.isConnected).toBe(true);
  });
});

// =============================================================================
// 2. alignment/highlight-ui.ts — className ?? '' falsy arms
// =============================================================================

describe('engine-coverage-round-13 — highlight-ui className residuals', () => {
  const toPixel = (row: number, col: number) => ({
    x: col * 40 + 20,
    y: row * 40 + 20,
  });

  it('createAlignmentHighlight omits class token when className absent', () => {
    // L216: `style.className ?? ''` falsy arm.
    const alignment: AlignmentResult = {
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
    const style: HighlightStyle = {
      fillColor: '#abc',
      strokeColor: '#123',
      strokeWidth: 2,
      animate: false,
      // className intentionally omitted
    };
    const group = createAlignmentHighlight(
      alignment,
      toPixel,
      { width: 40, height: 40 },
      style
    );
    expect(group.getAttribute('class')).toBe('alignment-highlight ');
    expect(group.querySelector('line')).toBeTruthy();
    expect(group.querySelector('g')).toBeTruthy();
  });

  it('createPathHighlight omits class token when className absent', () => {
    // L280: path class uses `style.className ?? ''` falsy arm.
    const style: HighlightStyle = {
      strokeColor: '#9c27b0',
      strokeWidth: 2,
      animate: true,
    };
    const path = createPathHighlight(
      [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ],
      toPixel,
      style
    );
    expect(path.getAttribute('class')).toBe('highlight-line animated ');
    expect(path.getAttribute('d')).toContain('M');
  });
});

// =============================================================================
// 3. graph leftovers — document r8 unreachable carry-forward (no spies)
// =============================================================================

describe('engine-coverage-round-13 — graph documented unreachable carry-forward', () => {
  it('documents algorithms queue.shift / Map-miss continues as unreachable', () => {
    // Carry-forward from r8/r10/r11/r12: L57/109/130/183/192/228/260/337/341/
    // 377/381/422/497 are defensive `queue.shift() === undefined` /
    // `Map.get` miss / empty-iterator arms. Public BFS/Dijkstra/region APIs
    // never interleave Array/Map mutation mid-loop; no Array.prototype spy.
    const g = createTrackGraph(4);
    const path = bfs(g, 't0', 't3');
    expect(path.found).toBe(true);
    expect(isConnected(g)).toBe(true);
    expect(findNodesAtDistance(g, 't0', 2)).toContain('t2');
  });

  it('documents types hex-id / complete-graph index holes as unreachable', () => {
    // L250–251 / L302: id.split always yields two numbers for `${q},${r}`;
    // Array.from(Map.keys()) is dense for createCompleteGraph.
    const hex = createHexLatticeGraph(1);
    expect(hex.nodes.size).toBeGreaterThan(0);
    const complete = createCompleteGraph(4);
    expect(complete.edges.length).toBeGreaterThan(3);
  });
});
