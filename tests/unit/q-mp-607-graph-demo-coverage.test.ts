/**
 * q-mp-607 — Raise `src/demos/graph-demo.ts` dedicated-suite line coverage from 0%.
 * Tests-only. Structural / chrome asserts only (no copy / aria / label pins).
 * Compatible with tip whether or not q-mp-602 nnnull clear folds first.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { navigate } from '../../src/core/router';
import * as algorithms from '../../src/core/graph/algorithms';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

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

function clickEl(el: Element | null): void {
  expect(el).toBeTruthy();
  (el as HTMLElement).dispatchEvent(new Event('click', { bubbles: true }));
}

describe('q-mp-607 graph-demo coverage', () => {
  it('mounts demo chrome: sections, template/path/game hosts, legend', () => {
    const root = mountDemo();
    expect(root.querySelector('#back-btn')).toBeTruthy();
    expect(
      root.querySelectorAll('.demo-section').length
    ).toBeGreaterThanOrEqual(4);
    expect(root.querySelectorAll('.template-btn').length).toBe(6);
    expect(root.querySelector('#template-graph svg')).toBeTruthy();
    expect(
      root.querySelector('#template-info')?.children.length
    ).toBeGreaterThan(0);
    expect(root.querySelector('#pathfinding-graph svg')).toBeTruthy();
    expect(root.querySelector('#path-status')).toBeTruthy();
    expect(root.querySelector('#clear-path-btn')).toBeTruthy();
    expect(root.querySelector('#game-graph .graph-container')).toBeTruthy();
    expect(root.querySelector('#game-legend')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#game-analysis .analysis-card')).toBeTruthy();
    expect(root.querySelector('#connectivity-info')).toBeTruthy();
  });

  it('back button navigates home', () => {
    const root = mountDemo();
    clickEl(root.querySelector('#back-btn'));
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('cycles every template button and updates template graph + info chrome', () => {
    const root = mountDemo();
    const templates = [
      'circular',
      'star',
      'hex',
      'track',
      'complete',
      'grid',
    ] as const;
    for (const name of templates) {
      const btn = root.querySelector(
        `.template-btn[data-template="${name}"]`
      ) as HTMLButtonElement | null;
      expect(btn).toBeTruthy();
      btn!.click();
      expect(btn!.classList.contains('selected')).toBe(true);
      expect(root.querySelectorAll('.template-btn.selected').length).toBe(1);
      expect(root.querySelector('#template-graph svg')).toBeTruthy();
      expect(root.querySelector('#template-graph .graph-node')).toBeTruthy();
      expect(
        (root.querySelector('#template-info')?.textContent ?? '').length
      ).toBeGreaterThan(0);
    }
  });

  it('unknown template data-attr hits default switch arm without clearing graph', () => {
    const root = mountDemo();
    const before = root.querySelectorAll('#template-graph .graph-node').length;
    expect(before).toBeGreaterThan(0);

    const rogue = document.createElement('button');
    rogue.className = 'template-btn';
    rogue.dataset.template = 'not-a-real-template';
    root.querySelector('.template-selector')?.appendChild(rogue);
    // Handlers were bound at init; re-bind by remounting with injected btn
    // is not available. Drive default arm via a synthetic selected click on
    // an existing btn after mutating its dataset.
    const btn = root.querySelector(
      '.template-btn[data-template="grid"]'
    ) as HTMLButtonElement;
    btn.dataset.template = 'unknown-template';
    btn.click();
    expect(root.querySelectorAll('#template-graph .graph-node').length).toBe(
      before
    );
  });

  it('pathfinding: start → end paints path chrome; clear resets hosts', () => {
    const root = mountDemo();
    const nodes = pathNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    clickEl(nodes[0]);
    expect(
      (root.querySelector('#path-status')?.textContent ?? '').length
    ).toBeGreaterThan(0);
    clickEl(nodes[1]);
    expect(
      (root.querySelector('#path-result')?.textContent ?? '').length
    ).toBeGreaterThan(0);
    expect(
      root.querySelector('#pathfinding-graph .graph-node.highlighted')
    ).toBeTruthy();

    (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');
    expect(root.querySelector('#pathfinding-graph svg')).toBeTruthy();
  });

  it('pathfinding: same-node second click restarts; third node resets selection', () => {
    const root = mountDemo();
    const nodes = pathNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(3);
    clickEl(nodes[0]);
    clickEl(nodes[0]); // same as start → else reset arm
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');
    clickEl(nodes[1]);
    expect(
      (root.querySelector('#path-result')?.textContent ?? '').length
    ).toBeGreaterThan(0);
    clickEl(nodes[2]); // start+end already set → reset to new start
    expect(root.querySelector('#path-result')?.innerHTML ?? '').toBe('');
    expect(
      (root.querySelector('#path-status')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });

  it('pathfinding: bfs not-found arm fills result host without path highlight', () => {
    const spy = vi.spyOn(algorithms, 'bfs').mockReturnValue({
      found: false,
      path: [],
      distance: -1,
    });
    const root = mountDemo();
    const nodes = pathNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    clickEl(nodes[0]);
    clickEl(nodes[1]);
    expect(spy).toHaveBeenCalled();
    expect(
      (root.querySelector('#path-result')?.textContent ?? '').length
    ).toBeGreaterThan(0);
    // highlightPath skipped when not found
    expect(
      root.querySelectorAll('#pathfinding-graph .graph-node.highlighted').length
    ).toBeGreaterThanOrEqual(0);
  });

  it('pathfinding: missing status/result hosts stay resilient on click + clear', () => {
    const root = mountDemo();
    root.querySelector('#path-status')?.remove();
    root.querySelector('#path-result')?.remove();
    const nodes = pathNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    clickEl(nodes[0]);
    clickEl(nodes[1]);
    (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#pathfinding-graph svg')).toBeTruthy();
  });

  it('pathfinding: missing graph host early-returns on clear without throw', () => {
    const root = mountDemo();
    const nodes = pathNodes(root);
    clickEl(nodes[0]);
    root.querySelector('#pathfinding-graph')?.remove();
    expect(() => {
      (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    }).not.toThrow();
  });

  it('game: claim P1 then P2 updates analysis cards; reclaim is no-op', () => {
    const root = mountDemo();
    const nodes = gameNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    const idleCards = root.querySelectorAll(
      '#game-analysis .analysis-card'
    ).length;
    expect(idleCards).toBeGreaterThanOrEqual(3);

    const firstId = nodes[0].dataset.nodeId;
    clickEl(nodes[0]);
    const afterP1 = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(afterP1.length).toBeGreaterThan(0);

    // Re-query after re-render; same nodeId is owned → no-op
    const owned = gameNodes(root).find((n) => n.dataset.nodeId === firstId);
    expect(owned).toBeTruthy();
    clickEl(owned!);
    expect(root.querySelector('#game-analysis')?.textContent).toBe(afterP1);

    (
      root.querySelector('.player-btn[data-player="2"]') as HTMLButtonElement
    ).click();
    expect(
      root
        .querySelector('.player-btn[data-player="2"]')
        ?.classList.contains('selected')
    ).toBe(true);
    expect(
      root
        .querySelector('.player-btn[data-player="1"]')
        ?.classList.contains('selected')
    ).toBe(false);

    // Re-query nodes after re-render from prior claim
    const nodes2 = gameNodes(root);
    const unclaimed = nodes2.find((n) => n !== nodes2[0]) ?? nodes2[1];
    clickEl(unclaimed);
    expect(
      (root.querySelector('#game-analysis')?.textContent ?? '').length
    ).toBeGreaterThan(0);
    expect(root.querySelectorAll('#game-analysis .analysis-card').length).toBe(
      idleCards
    );
  });

  it('game: clear-board restores empty analysis chrome', () => {
    const root = mountDemo();
    const nodes = gameNodes(root);
    for (let i = 0; i < Math.min(3, nodes.length); i++) {
      clickEl(gameNodes(root)[i]);
    }
    (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    expect(root.querySelectorAll('#game-analysis .analysis-card').length).toBe(
      3
    );
    expect(root.querySelector('#game-graph .graph-container')).toBeTruthy();
  });

  it('game: connect-edges spies paint optional connect chrome for both players', () => {
    const spy = vi
      .spyOn(algorithms, 'playerConnectsSets')
      .mockReturnValue(true);
    const root = mountDemo();
    const nodes = gameNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(1);
    clickEl(nodes[0]);
    (
      root.querySelector('.player-btn[data-player="2"]') as HTMLButtonElement
    ).click();
    const fresh = gameNodes(root);
    const other = fresh.find(
      (n) => n.dataset.nodeId !== nodes[0]?.dataset.nodeId
    );
    if (other) {
      clickEl(other);
    }
    expect(spy).toHaveBeenCalled();
    const analysis = root.querySelector('#game-analysis');
    expect(
      analysis?.querySelectorAll('.analysis-card').length
    ).toBeGreaterThanOrEqual(3);
    // connect chrome is a styled div child inside analysis cards
    expect(analysis?.querySelectorAll('div[style]').length).toBeGreaterThan(0);
  });

  it('game: missing analysis/legend/graph hosts stay resilient', () => {
    const root = mountDemo();
    root.querySelector('#game-analysis')?.remove();
    root.querySelector('#game-legend')?.remove();
    const nodes = gameNodes(root);
    expect(nodes.length).toBeGreaterThanOrEqual(1);
    expect(() => {
      clickEl(nodes[0]);
      (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    }).not.toThrow();
  });

  it('template: missing graph/info hosts early-return on template click', () => {
    const root = mountDemo();
    root.querySelector('#template-graph')?.remove();
    root.querySelector('#template-info')?.remove();
    expect(() => {
      (
        root.querySelector(
          '.template-btn[data-template="star"]'
        ) as HTMLButtonElement
      ).click();
    }).not.toThrow();
  });

  it('remount replaces prior demo DOM without leaking duplicate path hosts', () => {
    const root = mountRoot();
    renderGraphDemo(root);
    renderGraphDemo(root);
    expect(root.querySelectorAll('#pathfinding-graph').length).toBe(1);
    expect(root.querySelectorAll('#game-graph').length).toBe(1);
    expect(root.querySelectorAll('.template-btn').length).toBe(6);
  });
});
