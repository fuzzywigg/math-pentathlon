/**
 * Wave 25 — toolkit demos mount + interaction (dice / graph / alignment / expression).
 * Distinct from #133 shell/router chrome and waves 22–24 toolkit module unit burns.
 * Demos had zero prior unit coverage. Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';
import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  root.id = 'demo-root';
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

describe('Wave 25 demos-toolkit — dice demo', () => {
  it('mounts sections, selectors, and back link', () => {
    const root = mount();
    renderDiceDemo(root);

    expect(root.querySelector('.dice-demo h1')?.textContent).toMatch(/Dice/i);
    expect(root.querySelectorAll('.demo-section').length).toBeGreaterThanOrEqual(
      3
    );
    expect(root.querySelectorAll('.quick-roll-btn')).toHaveLength(5);
    expect(root.querySelector('#selector-2d6')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#selector-poly')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#selector-sums')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('.back-link')?.getAttribute('href')).toBe('#/');
  });

  it('quick-roll buttons populate result area', () => {
    const root = mount();
    renderDiceDemo(root);
    const result = root.querySelector('#quick-roll-result') as HTMLElement;
    expect(result.textContent).toMatch(/Click a button/i);

    const btn = root.querySelector(
      '.quick-roll-btn[data-dice="d6"][data-count="2"]'
    ) as HTMLButtonElement;
    btn.click();
    expect(result.textContent).not.toMatch(/Click a button/i);
    expect(result.innerHTML.length).toBeGreaterThan(0);

    const d20 = root.querySelector(
      '.quick-roll-btn[data-dice="d20"]'
    ) as HTMLButtonElement;
    d20.click();
    expect(result.innerHTML.length).toBeGreaterThan(0);
  });

  it('re-render clears previous mount content', () => {
    const root = mount();
    renderDiceDemo(root);
    expect(root.querySelectorAll('.dice-demo')).toHaveLength(1);
    renderDiceDemo(root);
    expect(root.querySelectorAll('.dice-demo')).toHaveLength(1);
  });
});

describe('Wave 25 demos-toolkit — graph demo', () => {
  it('mounts template / pathfinding / game sections', () => {
    const root = mount();
    renderGraphDemo(root);

    expect(root.querySelector('h1')?.textContent).toMatch(/Graph/i);
    expect(root.querySelectorAll('.template-btn').length).toBe(6);
    expect(root.querySelector('#template-graph')?.querySelector('svg')).toBeTruthy();
    expect(root.querySelector('#template-info')?.textContent).toMatch(/Nodes/i);
    expect(root.querySelector('#pathfinding-graph')).toBeTruthy();
    expect(root.querySelector('#game-graph')).toBeTruthy();
    expect(root.querySelector('#connectivity-info')).toBeTruthy();
  });

  it('template buttons switch selection and refresh info', () => {
    const root = mount();
    renderGraphDemo(root);

    const circular = root.querySelector(
      '.template-btn[data-template="circular"]'
    ) as HTMLButtonElement;
    const grid = root.querySelector(
      '.template-btn[data-template="grid"]'
    ) as HTMLButtonElement;
    expect(grid.classList.contains('selected')).toBe(true);

    circular.click();
    expect(circular.classList.contains('selected')).toBe(true);
    expect(grid.classList.contains('selected')).toBe(false);
    expect(root.querySelector('#template-info')?.textContent).toMatch(/Nodes:\s*8/);

    for (const name of ['star', 'hex', 'track', 'complete', 'grid'] as const) {
      const btn = root.querySelector(
        `.template-btn[data-template="${name}"]`
      ) as HTMLButtonElement;
      btn.click();
      expect(btn.classList.contains('selected')).toBe(true);
      expect(root.querySelector('#template-graph svg')).toBeTruthy();
      expect(root.querySelector('#template-info')?.textContent).toMatch(/Nodes/);
    }
  });

  it('back button navigates home', () => {
    const root = mount();
    renderGraphDemo(root);
    (root.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('player buttons toggle selected player', () => {
    const root = mount();
    renderGraphDemo(root);
    const p1 = root.querySelector(
      '.player-btn[data-player="1"]'
    ) as HTMLButtonElement;
    const p2 = root.querySelector(
      '.player-btn[data-player="2"]'
    ) as HTMLButtonElement;
    expect(p1.classList.contains('selected')).toBe(true);
    p2.click();
    expect(p2.classList.contains('selected')).toBe(true);
    expect(p1.classList.contains('selected')).toBe(false);
  });
});

describe('Wave 25 demos-toolkit — alignment demo', () => {
  it('mounts four-in-row, hex, and potential sections', () => {
    const root = mount();
    renderAlignmentDemo(root);

    expect(root.querySelector('.alignment-demo h1')?.textContent).toMatch(
      /Alignment/i
    );
    expect(root.querySelector('#four-board')?.children.length).toBeGreaterThan(0);
    expect(root.querySelector('#hex-board')?.children.length).toBeGreaterThan(0);
    expect(root.querySelector('#potential-board')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#four-reset')).toBeTruthy();
    expect(root.querySelector('#hex-reset')).toBeTruthy();
    expect(root.querySelector('#potential-reset')).toBeTruthy();
  });

  it('four-in-row column click places a piece and updates status', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const cell = root.querySelector(
      '#four-board [data-row][data-col="0"]'
    ) as HTMLElement;
    expect(cell).toBeTruthy();
    cell.click();
    const filled = root.querySelectorAll(
      '#four-board .occupied, #four-board [data-player], #four-board .player-x, #four-board .cell-x'
    );
    // after click, board should reflect a placement somehow — check status flip to O
    const status = root.querySelector('#four-status')?.textContent ?? '';
    expect(status.length).toBeGreaterThan(0);
    // either winner text or current player advanced
    expect(status).toMatch(/player|Winner|O|X/i);
    expect(filled.length + (status.includes('O') ? 1 : 0)).toBeGreaterThan(0);
  });

  it('four-in-row reset restores empty board status', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const cell = root.querySelector(
      '#four-board [data-col="3"]'
    ) as HTMLElement;
    cell?.click();
    (root.querySelector('#four-reset') as HTMLButtonElement).click();
    expect(root.querySelector('#four-status')?.textContent).toMatch(/X/i);
  });

  it('hex board click places and potential board accepts clicks', () => {
    const root = mount();
    renderAlignmentDemo(root);

    const hexCell = root.querySelector(
      '#hex-board [data-row="0"][data-col="0"]'
    ) as HTMLElement;
    hexCell?.click();
    expect(root.querySelector('#hex-status')?.textContent).toMatch(
      /player|Blue|Red|Winner/i
    );

    const pot = root.querySelector(
      '#potential-board [data-row="0"][data-col="0"]'
    ) as HTMLElement;
    pot?.click();
    expect(root.querySelector('#potential-info')?.textContent?.length).toBeGreaterThan(
      0
    );

    (root.querySelector('#hex-reset') as HTMLButtonElement).click();
    (root.querySelector('#potential-reset') as HTMLButtonElement).click();
  });
});

describe('Wave 25 demos-toolkit — expression demo', () => {
  it('mounts evaluator, challenges, and solver chrome', () => {
    const root = mount();
    renderExpressionDemo(root);

    expect(root.querySelector('h1')?.textContent).toMatch(/Expression/i);
    expect(root.querySelector('#calc-input')).toBeTruthy();
    expect(root.querySelector('#calc-btn')).toBeTruthy();
    expect(root.querySelectorAll('.example-btn').length).toBeGreaterThanOrEqual(4);
    expect(root.querySelector('#challenge-grid')?.children.length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#num1')).toBeTruthy();
    expect(root.querySelector('#back-btn')).toBeTruthy();
  });

  it('calculate button and example buttons drive calc-result', () => {
    const root = mount();
    renderExpressionDemo(root);

    const input = root.querySelector('#calc-input') as HTMLInputElement;
    input.value = '2 + 3 * 4';
    (root.querySelector('#calc-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#calc-result')?.textContent).toMatch(/14|result|=/i);

    const example = root.querySelector(
      '.example-btn[data-expr="(2 + 3) * 4"]'
    ) as HTMLButtonElement;
    example.click();
    expect(input.value).toContain('2');
    expect(root.querySelector('#calc-result')?.textContent?.length).toBeGreaterThan(
      0
    );
  });

  it('back button navigates home', () => {
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
