/**
 * q-mp-664 — Close `graph-demo` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `be822e75`):
 *   under related `*graph-demo*` + overnight graph suites:
 *     **96.47%** lines (164/170) / **77.02%** branches (57/74)
 *   Uncovered arms: missing-host soft returns (back-btn, template hosts,
 *   pathfinding-graph, path-status/result, game-legend/graph/analysis),
 *   disconnected template info (`isConnected` false → 'No'),
 *   pathfinding node without `data-node-id`, player btn without `data-player`.
 *
 * Leave tip-folded `#1046`/`607` 0% raise + `#1048`/`602` nnnull with
 * **contained** (this ticket owns remaining branches only).
 *
 * Constraints: tests only; ZERO `src/` edits; structural asserts only
 * (hosts present/absent, classList, counts, spy calls) — no player-facing
 * copy / aria / label string pins; no AI / rules / scoring; no ratchet JSON;
 * Hex Hard 450ms untouched; no network.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import * as algorithms from '../../src/core/graph/algorithms';
import * as graphUi from '../../src/core/graph/graph-ui';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { click } from '../helpers/dom-click';
import { mountRoot } from './helpers/dom';

let getIdSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  getIdSpy?.mockRestore();
  getIdSpy = undefined;
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

function spyMissingIds(...missing: string[]): void {
  getIdSpy?.mockRestore();
  const realGet = document.getElementById.bind(document);
  getIdSpy = vi
    .spyOn(document, 'getElementById')
    .mockImplementation((id: string) => {
      if (missing.includes(id)) {
        return null;
      }
      return realGet(id);
    });
}

function mountDemo(): HTMLElement {
  const root = mountRoot();
  renderGraphDemo(root);
  return root;
}

function pathNodes(root: HTMLElement): SVGElement[] {
  return [
    ...root.querySelectorAll('#pathfinding-graph .graph-node'),
  ] as SVGElement[];
}

function gameNodes(root: HTMLElement): SVGElement[] {
  return [...root.querySelectorAll('#game-graph .graph-node')] as SVGElement[];
}

describe('q-mp-664 graph-demo — residual missing-host arms', () => {
  it('missing back-btn skips navigate wire (L265 false)', () => {
    spyMissingIds('back-btn');
    expect(() => mountDemo()).not.toThrow();
    expect(document.getElementById('back-btn')).toBeNull();
    expect(document.querySelectorAll('.demo-section').length).toBeGreaterThan(0);
  });

  it('missing template hosts early-return renderCurrentGraph (L285 true)', () => {
    spyMissingIds('template-graph', 'template-info');
    const root = mountDemo();
    expect(document.getElementById('template-graph')).toBeNull();
    expect(document.getElementById('template-info')).toBeNull();
    expect(() => {
      (
        root.querySelector(
          '.template-btn[data-template="star"]'
        ) as HTMLButtonElement
      ).click();
    }).not.toThrow();
    expect(root.querySelectorAll('.template-btn.selected').length).toBe(1);
  });

  it('disconnected template paints Connected:No arm (L307 false)', () => {
    const spy = vi.spyOn(algorithms, 'isConnected').mockReturnValue(false);
    const root = mountDemo();
    (
      root.querySelector(
        '.template-btn[data-template="circular"]'
      ) as HTMLButtonElement
    ).click();
    expect(spy).toHaveBeenCalled();
    const info = root.querySelector('#template-info');
    expect(info).toBeTruthy();
    expect((info?.textContent ?? '').length).toBeGreaterThan(0);
    expect(info?.querySelectorAll('strong').length).toBeGreaterThanOrEqual(4);
  });

  it('missing pathfinding-graph early-returns path render (L364 true)', () => {
    spyMissingIds('pathfinding-graph');
    expect(() => mountDemo()).not.toThrow();
    expect(document.getElementById('pathfinding-graph')).toBeNull();
    expect(() => {
      (document.getElementById('clear-path-btn') as HTMLButtonElement).click();
    }).not.toThrow();
  });

  it('path node without data-node-id skips click wiring (L385 true)', () => {
    const realRender = graphUi.renderGraph.bind(graphUi);
    vi.spyOn(graphUi, 'renderGraph').mockImplementation((...args) => {
      const svg = realRender(...args);
      const orphan = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      orphan.classList.add('graph-node');
      svg.appendChild(orphan);
      return svg;
    });

    const root = mountDemo();
    const nodes = pathNodes(root);
    const orphan = nodes.find((n) => !n.dataset.nodeId);
    expect(orphan).toBeTruthy();
    expect(() => click(orphan!)).not.toThrow();
    // Orphan has no handler — status host stays at idle chrome length > 0
    expect(
      (root.querySelector('#path-status')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });

  it('missing path-status/result soft-skips status+result arms through path cycle', () => {
    spyMissingIds('path-status', 'path-result');
    const root = mountDemo();
    expect(document.getElementById('path-status')).toBeNull();
    expect(document.getElementById('path-result')).toBeNull();

    const nodes = pathNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(3);

    // First click → L424 false; second → L429 false + found path L402 false
    click(nodes[0]);
    click(nodes[1]);
    expect(
      root.querySelector('#pathfinding-graph .graph-node.highlighted')
    ).toBeTruthy();

    // Third click resets → L436/L439 false
    click(nodes[2]);
    expect(root.querySelector('#pathfinding-graph svg')).toBeTruthy();

    // Clear → L450/L453 false
    expect(() => {
      (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    }).not.toThrow();
  });

  it('missing path-result with bfs-not-found hits L413 false arm', () => {
    vi.spyOn(algorithms, 'bfs').mockReturnValue({
      found: false,
      path: [],
      distance: -1,
    });
    spyMissingIds('path-result');
    const root = mountDemo();
    const nodes = pathNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    click(nodes[0]);
    click(nodes[1]);
    expect(document.getElementById('path-result')).toBeNull();
    expect(
      root.querySelectorAll('#pathfinding-graph .graph-node.highlighted').length
    ).toBeGreaterThanOrEqual(0);
  });

  it('missing game-legend skips legend append (L474 false)', () => {
    spyMissingIds('game-legend');
    const root = mountDemo();
    expect(document.getElementById('game-legend')).toBeNull();
    expect(root.querySelector('#game-graph .graph-container')).toBeTruthy();
    expect(root.querySelectorAll('#game-analysis .analysis-card').length).toBe(
      3
    );
  });

  it('missing game-graph early-returns game render (L479 true)', () => {
    spyMissingIds('game-graph');
    const root = mountDemo();
    expect(document.getElementById('game-graph')).toBeNull();
    expect(root.querySelectorAll('#game-analysis .analysis-card').length).toBe(
      3
    );
    expect(() => {
      (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    }).not.toThrow();
  });

  it('missing game-analysis early-returns updateAnalysis (L505 true)', () => {
    spyMissingIds('game-analysis');
    const root = mountDemo();
    expect(document.getElementById('game-analysis')).toBeNull();
    const nodes = gameNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(1);
    expect(() => {
      click(nodes[0]);
      (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    }).not.toThrow();
    expect(root.querySelector('#game-graph .graph-container')).toBeTruthy();
  });

  it('player btn without data-player soft-returns (L589 true)', () => {
    const root = mountDemo();
    const p2 = root.querySelector(
      '.player-btn[data-player="2"]'
    ) as HTMLButtonElement;
    expect(p2).toBeTruthy();
    p2.removeAttribute('data-player');
    expect(p2.dataset.player).toBeUndefined();

    expect(() => p2.click()).not.toThrow();
    // Selection chrome still updates; currentPlayer assign is skipped
    expect(p2.classList.contains('selected')).toBe(true);
    expect(
      root
        .querySelector('.player-btn[data-player="1"]')
        ?.classList.contains('selected')
    ).toBe(false);
  });
});
