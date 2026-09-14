/**
 * Overnight demos leftover — empty root / double-mount / wipe identity.
 * Existing demo render APIs only. Tests-only. No product inventing.
 * Distinct from wave25 smoke, timer-penalty (#189), multiplayer (#191), puzzle banks (#192).
 * Fake timers: dice autoRoll animateRoll must not outlive jsdom teardown.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  root.id = 'overnight-demo-root';
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
  // Dice demo mounts DiceSelector with autoRoll:true → animateRoll setTimeout chain.
  // Fake timers so afterEach can clear before jsdom teardown (avoids document-not-defined).
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

const RENDERERS: Array<{
  name: string;
  render: (el: HTMLElement) => void;
  chrome: RegExp;
}> = [
  { name: 'dice', render: renderDiceDemo, chrome: /Dice/i },
  { name: 'graph', render: renderGraphDemo, chrome: /Graph/i },
  { name: 'alignment', render: renderAlignmentDemo, chrome: /Alignment/i },
  { name: 'expression', render: renderExpressionDemo, chrome: /Expression/i },
  { name: 'attribute', render: renderAttributeDemo, chrome: /Attribute/i },
  { name: 'fraction', render: renderFractionDemo, chrome: /Fraction/i },
  { name: 'polyomino', render: renderPolyominoDemo, chrome: /Polyomino/i },
];

describe('Overnight demos — empty remount wipe', () => {
  it.each(RENDERERS)(
    '$name mounts into empty root with brand chrome',
    ({ render, chrome }) => {
      const root = mount();
      expect(root.childNodes).toHaveLength(0);
      render(root);
      expect(root.querySelector('h1')?.textContent).toMatch(chrome);
      expect(root.innerHTML.length).toBeGreaterThan(200);
    }
  );

  it.each(RENDERERS)(
    '$name double-mount leaves a single coherent tree',
    ({ render, chrome }) => {
      const root = mount();
      render(root);
      const firstLen = root.innerHTML.length;
      render(root);
      expect(root.querySelectorAll('h1')).toHaveLength(1);
      expect(root.querySelector('h1')?.textContent).toMatch(chrome);
      // remount replaces rather than stacking
      expect(root.innerHTML.length).toBeGreaterThan(100);
      expect(Math.abs(root.innerHTML.length - firstLen)).toBeLessThan(
        firstLen
      );
    }
  );

  it('cross-demo remount replaces prior demo entirely', () => {
    const root = mount();
    renderDiceDemo(root);
    expect(root.querySelector('.dice-demo')).toBeTruthy();
    expect(root.querySelectorAll('.quick-roll-btn')).toHaveLength(5);

    renderFractionDemo(root);
    expect(root.querySelector('.dice-demo')).toBeNull();
    expect(root.querySelector('#fraction-a')).toBeTruthy();
    expect(root.querySelector('h1')?.textContent).toMatch(/Fraction/i);

    renderPolyominoDemo(root);
    expect(root.querySelector('#fraction-a')).toBeNull();
    expect(root.querySelector('#shape-gallery')).toBeTruthy();
  });

  it('detached empty container remount still paints without throw', () => {
    const detached = document.createElement('div');
    expect(() => renderDiceDemo(detached)).not.toThrow();
    expect(detached.querySelector('.dice-demo')).toBeTruthy();

    expect(() => renderAlignmentDemo(detached)).not.toThrow();
    expect(detached.querySelector('.alignment-demo')).toBeTruthy();
    expect(detached.querySelector('.dice-demo')).toBeNull();
  });

  it('pre-seeded junk children are wiped on first render', () => {
    const root = mount();
    root.innerHTML = '<p class="junk">stale</p><div id="ghost">x</div>';
    expect(root.querySelector('.junk')).toBeTruthy();

    renderGraphDemo(root);
    expect(root.querySelector('.junk')).toBeNull();
    expect(root.querySelector('#ghost')).toBeNull();
    expect(root.querySelector('#template-graph')).toBeTruthy();
  });
});
