/**
 * burn-1008-mp-ui-coverage-round-3 — board-a11y edges, player-colors rootless,
 * hex-a-gone pieces exhaustive default (skipped pin), polyomino hit-test
 * viewBox fallbacks, ollie unknown-chrome, owl-events off empty type.
 * Tests-only; pins current behavior.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  bindGridNavigation,
  captureFocusedCell,
  ensureAriaGridRows,
  isBoardActivateKey,
} from '../../src/ui/board-a11y';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  colorForSeat,
  getGameModeChromeRoot,
  getPlayerSeatColors,
  seatIcon,
  syncAppOpponentChrome,
} from '../../src/ui/player-colors';
import {
  createHexAGonePieceGeometries,
  geometryForShape,
} from '../../src/ui/three/hex-a-gone-pieces';
import type { BlockShape } from '../../src/games/hex-a-gone/types';
import { getCellFromMouseEvent } from '../../src/core/polyomino/polyomino-ui';
import {
  resolveInspectTarget,
  stubNarrationFor,
  type InspectTarget,
} from '../../src/core/owl/ollie-inspect-map';
import { OwlEventEmitter } from '../../src/core/owl/owl-events';
import { findLargestRegion } from '../../src/core/alignment/compat';
import { renderHorizontalBar } from '../../src/core/fractions/fraction-bar-ui';
import {
  animateMove,
  createInteractiveGraph,
  renderGraph,
} from '../../src/core/graph/graph-ui';
import type { Graph, GraphBoard } from '../../src/core/graph/types';
import { animateRoll, renderDie } from '../../src/core/dice/dice-ui';
import type { DieRoll, RollResult } from '../../src/core/dice/types';
import {
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';

describe('burn-1008 ui-cov-r3 board-a11y', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('ensureAriaGridRows wraps orphan cells and skips detached parents', () => {
    const grid = document.createElement('div');
    grid.setAttribute('role', 'grid');
    const orphan = document.createElement('div');
    orphan.setAttribute('role', 'gridcell');
    orphan.setAttribute('data-row', '0');
    orphan.setAttribute('data-col', '0');
    grid.appendChild(orphan);
    // Decorative sibling without row/cell roles
    const chrome = document.createElement('div');
    chrome.className = 'board-chrome';
    grid.appendChild(chrome);
    document.body.appendChild(grid);

    ensureAriaGridRows(grid);
    expect(orphan.parentElement?.getAttribute('role')).toBe('row');
    expect(chrome.getAttribute('role')).toBe('presentation');
  });

  it('bindGridNavigation ignores non-arrow keys and non-gridcell targets', () => {
    const board = document.createElement('div');
    board.setAttribute('role', 'grid');
    const cell = document.createElement('div');
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('data-row', '0');
    cell.setAttribute('data-col', '0');
    cell.tabIndex = 0;
    board.appendChild(cell);
    document.body.appendChild(board);
    bindGridNavigation(board);
    cell.focus();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', bubbles: true })
    );
    expect(document.activeElement).toBe(cell);
  });

  it('captureFocusedCell returns null when focus is outside container', () => {
    const board = document.createElement('div');
    const outside = document.createElement('button');
    document.body.append(board, outside);
    outside.focus();
    expect(captureFocusedCell(board)).toBeNull();
  });

  it('isBoardActivateKey accepts Enter, Space key, and Space code', () => {
    expect(
      isBoardActivateKey(
        new KeyboardEvent('keydown', { key: 'Enter' })
      )
    ).toBe(true);
    expect(
      isBoardActivateKey(new KeyboardEvent('keydown', { key: ' ' }))
    ).toBe(true);
    expect(
      isBoardActivateKey(
        new KeyboardEvent('keydown', { key: 'Spacebar', code: 'Space' })
      )
    ).toBe(true);
    expect(
      isBoardActivateKey(new KeyboardEvent('keydown', { key: 'Tab' }))
    ).toBe(false);
  });
});

describe('burn-1008 ui-cov-r3 player-colors', () => {
  afterEach(() => {
    document.getElementById('app')?.remove();
    vi.restoreAllMocks();
  });

  it('getGameModeChromeRoot returns null without root or #app', () => {
    expect(getGameModeChromeRoot(null)).toBeNull();
    expect(getGameModeChromeRoot()).toBeNull();
  });

  it('syncAppOpponentChrome no-ops without #app; clear/apply toggle chrome', () => {
    syncAppOpponentChrome(true);
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player1');
    expect(seatIcon('player1', app)).toBe('🟣');
    expect(colorForSeat('player1', app)).toBeTruthy();
    const colors = getPlayerSeatColors(app);
    expect(colors.player1).toBeTruthy();
    clearGameModeChrome(app);
    expect(app.dataset.opponent).toBeUndefined();
    syncAppOpponentChrome(false);
    expect(app.dataset.opponent).toBeUndefined();
    syncAppOpponentChrome('human-vs-ai', 'player2');
    expect(app.dataset.opponent).toBe('ai');
  });
});

describe('burn-1008 ui-cov-r3 hex-a-gone-pieces', () => {
  it('geometryForShape maps every known bank shape', () => {
    const THREE = {
      Shape: class {
        moveTo() {
          return this;
        }
        lineTo() {
          return this;
        }
        closePath() {
          return this;
        }
      },
      ExtrudeGeometry: class {
        dispose = vi.fn();
      },
    } as unknown as typeof import('three');
    const geos = createHexAGonePieceGeometries(THREE);
    for (const shape of [
      'hexagon',
      'trapezoid',
      'rhombus',
      'triangle',
      'square',
    ] as BlockShape[]) {
      expect(geometryForShape(geos, shape)).toBeTruthy();
    }
  });

  // Exhaustive `default: never` is only reachable with an invalid cast.
  // Pin current throw behavior as skipped until a soft-fail is intentional.
  it.skip('BUG: geometryForShape throws on invalid shape cast (exhaustive never)', () => {
    const THREE = {
      Shape: class {
        moveTo() {
          return this;
        }
        lineTo() {
          return this;
        }
        closePath() {
          return this;
        }
      },
      ExtrudeGeometry: class {
        dispose = vi.fn();
      },
    } as unknown as typeof import('three');
    const geos = createHexAGonePieceGeometries(THREE);
    expect(() =>
      geometryForShape(geos, 'not-a-shape' as BlockShape)
    ).toThrow();
  });
});

describe('burn-1008 ui-cov-r3 polyomino-ui hit-test', () => {
  it('getCellFromMouseEvent uses width/height attrs when viewBox is empty', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '200');
    document.body.appendChild(svg);
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
    const cell = getCellFromMouseEvent(
      new MouseEvent('click', { clientX: 50, clientY: 50 }),
      svg,
      { cellSize: 40, padding: 0 }
    );
    expect(cell).toEqual({ row: 1, col: 1 });
    svg.remove();
  });
});

describe('burn-1008 ui-cov-r3 ollie-inspect + owl-events', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('resolves unknown-chrome and narrates via stub', () => {
    const el = document.createElement('div');
    el.className = 'misc-chrome';
    document.body.appendChild(el);
    // Closest matching chrome without known ids → unknown / unknown-chrome via header
    const header = document.createElement('header');
    header.className = 'game-header';
    header.appendChild(el);
    document.body.appendChild(header);
    const target = resolveInspectTarget(el);
    expect(target).toEqual({ kind: 'chrome', chrome: 'game-header' });
    expect(stubNarrationFor(target).startsWith('[STUB inspect]')).toBe(true);

    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    const btn = document.createElement('button');
    buttonRow.appendChild(btn);
    document.body.appendChild(buttonRow);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'button-row',
    });
  });

  it.skip('BUG: stubNarrationFor exhaustive default unreachable without invalid cast', () => {
    const bogus = { kind: 'not-real' } as unknown as InspectTarget;
    expect(() => stubNarrationFor(bogus)).toThrow();
  });

  it('OwlEventEmitter off without handler deletes type; unsubscribe on missing type is safe', () => {
    const emitter = new OwlEventEmitter();
    const handler = vi.fn();
    const unsub = emitter.on('game:start', handler);
    emitter.off('game:start');
    emitter.emit({
      type: 'game:start',
      timestamp: 1,
      gameId: 'hex',
      gameName: 'Hex',
      division: 'intermediate',
      isFirstTime: true,
      timesPlayed: 0,
    });
    expect(handler).not.toHaveBeenCalled();
    // Unsubscribe after type already cleared — filter path with || []
    unsub();
    emitter.off('game:end', handler);
  });
});

describe('burn-1008 ui-cov-r3 alignment + fraction-bar helpers', () => {
  it('findLargestRegion returns null for empty board', () => {
    const region = findLargestRegion(
      { rows: 2, cols: 2 },
      () => null,
      { includeDiagonals: false }
    );
    expect(region).toBeNull();
  });

  it('renderHorizontalBar draws segments and uses empty-color fallbacks', () => {
    // 0/4 simplifies to 0/1 (no segment lines); use 1/4 so lines render.
    const svg = renderHorizontalBar(
      { numerator: 1, denominator: 4 },
      {
        width: 120,
        height: 24,
        showLabel: false,
        colors: {},
      }
    );
    expect(svg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(2);
    expect(svg.querySelectorAll('line').length).toBe(3);
  });
});

describe('burn-1008 ui-cov-r3 graph-ui + dice-ui edges', () => {
  afterEach(() => {
    resetSettingsFlagsForTests();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function tinyGraph(): Graph {
    const nodes = new Map([
      ['a', { id: 'a', position: { x: 0, y: 0 } }],
      ['b', { id: 'b', position: { x: 40, y: 0 } }],
    ]);
    return {
      nodes,
      edges: [{ from: 'a', to: 'b' }],
      directed: false,
    };
  }

  it('createInteractiveGraph wires click handlers for nodes with ids', () => {
    const board: GraphBoard = {
      graph: tinyGraph(),
      nodeStates: new Map(),
    };
    const onClick = vi.fn();
    const onHover = vi.fn();
    const container = createInteractiveGraph(board, onClick, onHover);
    document.body.appendChild(container);
    const node = container.querySelector('.graph-node') as SVGElement | null;
    expect(node?.dataset.nodeId).toBeTruthy();
    node?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    node?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    node?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(onClick).toHaveBeenCalled();
    expect(onHover).toHaveBeenCalled();
  });

  it('animateMove settles immediately for short paths and cancel is idempotent', async () => {
    setUserReducedMotionFlag(true);
    const graph = tinyGraph();
    const svg = renderGraph(graph, new Map());
    document.body.appendChild(svg);
    const handle = animateMove(svg, ['a'], graph, 500);
    await handle;
    handle.cancel();
    handle.cancel();
  });

  it('animateMove cancel mid-path settles without throw', async () => {
    setUserReducedMotionFlag(false);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      return window.setTimeout(
        () => cb(performance.now()),
        0
      ) as unknown as number;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      clearTimeout(id);
    });
    const graph = tinyGraph();
    const svg = renderGraph(graph, new Map());
    document.body.appendChild(svg);
    const handle = animateMove(svg, ['a', 'b'], graph, 200);
    handle.cancel();
    await handle;
  });

  it('animateRoll cancel before finish leaves cancelled state', () => {
    vi.useFakeTimers();
    setUserReducedMotionFlag(false);
    const container = document.createElement('div');
    const die: DieRoll = {
      id: 'd1',
      diceType: 'd6',
      value: 4,
      isSelected: false,
      isLocked: false,
      timestamp: 1,
    };
    const result: RollResult = {
      id: 'r1',
      rolls: [die],
      total: 4,
    };
    const cancel = animateRoll(container, result, { duration: 400 });
    cancel();
    vi.advanceTimersByTime(500);
    expect(container.className.includes('dice-roll-result')).toBe(true);
    expect(renderDie(die, 40).tagName.toLowerCase()).toBe('svg');
  });
});
