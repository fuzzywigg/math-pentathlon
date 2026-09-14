/**
 * Overnight demos leftover — graph template matrix + path clear + seat isolation.
 * Existing renderGraphDemo APIs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderGraphDemo } from '../../src/demos/graph-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const TEMPLATES = [
  'grid',
  'circular',
  'star',
  'hex',
  'track',
  'complete',
] as const;

describe('Overnight demos — graph path/template matrix', () => {
  it('exhausts every template with single selected + nodes info', () => {
    const root = mount();
    renderGraphDemo(root);

    for (const name of TEMPLATES) {
      const btn = root.querySelector(
        `.template-btn[data-template="${name}"]`
      ) as HTMLButtonElement;
      btn.click();
      expect(btn.classList.contains('selected')).toBe(true);
      expect(root.querySelectorAll('.template-btn.selected')).toHaveLength(1);
      expect(root.querySelector('#template-graph svg')).toBeTruthy();
      const info = root.querySelector('#template-info')?.textContent ?? '';
      expect(info).toMatch(/Nodes:\s*\d+/);
      expect(info).toMatch(/Edges:\s*\d+/);
      expect(info).toMatch(/Connected:\s*(Yes|No)/);
    }
  });

  it('pathfinding start→end→clear restores prompt', () => {
    const root = mount();
    renderGraphDemo(root);
    const status = root.querySelector('#path-status') as HTMLElement;
    expect(status.textContent).toMatch(/Click a node/i);

    const nodes = root.querySelectorAll(
      '#pathfinding-graph .graph-node'
    );
    expect(nodes.length).toBeGreaterThanOrEqual(2);
    (nodes[0] as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(status.textContent).toMatch(/Start:/);

    (nodes[1] as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(status.textContent).toMatch(/Path from/);
    const result = root.querySelector('#path-result')?.textContent ?? '';
    expect(result.length).toBeGreaterThan(0);

    (root.querySelector('#clear-path-btn') as HTMLButtonElement).click();
    expect(status.textContent).toMatch(/Click a node to set start/i);
    expect(
      (root.querySelector('#path-result') as HTMLElement).innerHTML
    ).toBe('');
  });

  it('third node click resets start without leftover end path', () => {
    const root = mount();
    renderGraphDemo(root);
    const nodes = Array.from(
      root.querySelectorAll('#pathfinding-graph .graph-node')
    ) as SVGElement[];
    nodes[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    nodes[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-result')?.textContent?.length).toBeGreaterThan(
      0
    );

    nodes[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('#path-status')?.textContent).toMatch(/Start:/);
    expect(
      (root.querySelector('#path-result') as HTMLElement).innerHTML
    ).toBe('');
  });

  it('player seat toggle + clear board resets analysis empty count', () => {
    const root = mount();
    renderGraphDemo(root);

    const p2 = root.querySelector(
      '.player-btn[data-player="2"]'
    ) as HTMLButtonElement;
    p2.click();
    expect(p2.classList.contains('selected')).toBe(true);
    expect(
      root.querySelector('.player-btn[data-player="1"]')?.classList.contains(
        'selected'
      )
    ).toBe(false);

    const gameNodes = root.querySelectorAll('#game-graph .graph-node');
    expect(gameNodes.length).toBeGreaterThan(0);
    (gameNodes[0] as SVGElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/Player 2|nodes|empty/i);

    (root.querySelector('#clear-game-btn') as HTMLButtonElement).click();
    const after = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(after).toMatch(/empty/i);
  });

  it('connectivity section mounts alongside game analysis chrome', () => {
    const root = mount();
    renderGraphDemo(root);
    // #connectivity-info is a reserved mount point (currently empty shell);
    // game analysis card is the live territory chrome next to it.
    const connectivity = root.querySelector('#connectivity-info');
    expect(connectivity).toBeTruthy();
    expect(connectivity?.classList.contains('connectivity-info')).toBe(true);
    const analysis = root.querySelector('#game-analysis')?.textContent ?? '';
    expect(analysis).toMatch(/Player 1|empty|nodes/i);
  });

  it('rapid template thrash leaves one svg and one selected btn', () => {
    const root = mount();
    renderGraphDemo(root);
    for (let i = 0; i < 18; i++) {
      const name = TEMPLATES[i % TEMPLATES.length];
      (
        root.querySelector(
          `.template-btn[data-template="${name}"]`
        ) as HTMLButtonElement
      ).click();
    }
    expect(root.querySelectorAll('#template-graph svg')).toHaveLength(1);
    expect(root.querySelectorAll('.template-btn.selected')).toHaveLength(1);
  });
});
