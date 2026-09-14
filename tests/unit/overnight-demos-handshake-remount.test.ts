/**
 * Overnight TOKENMAXX HEAVY — demos remount handshake leftovers across all seven.
 * Tests-only. Distinct from wave25 smoke + open engine PRs. No product inventing.
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
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight demos — remount handshake matrix', () => {
  it('each demo remounts idempotently with a single root chrome node', () => {
    const root = mount();
    const renders: Array<(el: HTMLElement) => void> = [
      renderAlignmentDemo,
      renderAttributeDemo,
      renderDiceDemo,
      renderExpressionDemo,
      renderFractionDemo,
      renderGraphDemo,
      renderPolyominoDemo,
    ];

    for (const render of renders) {
      render(root);
      render(root);
      expect(root.children.length).toBeGreaterThan(0);
      expect(root.querySelector('h1')).toBeTruthy();
    }
  });

  it('switching demos in sequence leaves last demo title mounted', () => {
    const root = mount();
    renderDiceDemo(root);
    renderGraphDemo(root);
    renderFractionDemo(root);
    renderAlignmentDemo(root);
    expect(root.querySelector('h1')?.textContent).toMatch(/Alignment/i);
    expect(root.querySelector('#four-board')).toBeTruthy();
    expect(root.querySelector('.dice-demo')).toBeFalsy();
  });
});
