/**
 * Overnight TOKENMAXX HEAVY — handshake remount matrix leftovers after #202.
 * Cross-demo wipe / sequential mount isolation. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

const DEMOS: Array<{
  name: string;
  render: (root: HTMLElement) => void;
  probe: string;
}> = [
  { name: 'alignment', render: renderAlignmentDemo, probe: '#four-board' },
  { name: 'attribute', render: renderAttributeDemo, probe: '#piece-grid' },
  { name: 'dice', render: renderDiceDemo, probe: '.quick-roll-btn' },
  { name: 'expression', render: renderExpressionDemo, probe: '#calc-input' },
  { name: 'fraction', render: renderFractionDemo, probe: '#interactive-bar' },
  { name: 'graph', render: renderGraphDemo, probe: '#template-graph' },
  { name: 'polyomino', render: renderPolyominoDemo, probe: '#shape-gallery' },
];

describe('Overnight demos45 — handshake remount matrix', () => {
  it('each demo mounts probe then survives wipe + cross-swap', () => {
    const root = mount();
    for (let i = 0; i < DEMOS.length; i++) {
      const a = DEMOS[i];
      const b = DEMOS[(i + 1) % DEMOS.length];
      root.innerHTML = '';
      a.render(root);
      if (a.name === 'dice') vi.advanceTimersByTime(1200);
      expect(root.querySelector(a.probe)).toBeTruthy();

      root.innerHTML = '';
      b.render(root);
      if (b.name === 'dice') vi.advanceTimersByTime(1200);
      expect(root.querySelector(b.probe)).toBeTruthy();
      expect(root.querySelector(a.probe)).toBeFalsy();
    }
  });

  it('detached root render does not throw for all demos', () => {
    for (const demo of DEMOS) {
      const detached = document.createElement('div');
      expect(() => demo.render(detached)).not.toThrow();
      expect(detached.querySelector(demo.probe)).toBeTruthy();
    }
  });
});
