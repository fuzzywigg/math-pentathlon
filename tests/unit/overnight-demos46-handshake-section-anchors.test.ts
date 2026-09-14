/**
 * Overnight TOKENMAXX HEAVY — demos46 handshake remount + cross-swap leftovers.
 * Distinct from #220 remount matrix. Tests-only.
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

describe('Overnight demos46 — handshake section anchors', () => {
  it('each demo exposes its primary interaction anchor after remount', () => {
    const root = mount();
    const cases: Array<{
      render: (el: HTMLElement) => void;
      title: RegExp;
      anchor: string;
    }> = [
      {
        render: renderAlignmentDemo,
        title: /Alignment/i,
        anchor: '#four-board',
      },
      {
        render: renderAttributeDemo,
        title: /Attribute/i,
        anchor: '#set-grid',
      },
      { render: renderDiceDemo, title: /Dice/i, anchor: '#selector-2d6' },
      {
        render: renderExpressionDemo,
        title: /Expression/i,
        anchor: '#challenge-grid',
      },
      {
        render: renderFractionDemo,
        title: /Fraction/i,
        anchor: '#interactive-bar',
      },
      {
        render: renderGraphDemo,
        title: /Graph/i,
        anchor: '#pathfinding-graph',
      },
      {
        render: renderPolyominoDemo,
        title: /Polyomino/i,
        anchor: '#board-container',
      },
    ];

    for (const c of cases) {
      c.render(root);
      c.render(root);
      expect(root.querySelector('h1')?.textContent).toMatch(c.title);
      expect(root.querySelector(c.anchor)).toBeTruthy();
      // alignment/dice use .back-link; others use #back-btn
      expect(
        root.querySelector('#back-btn, .back-link, .back-button')
      ).toBeTruthy();
    }
  });

  it('cross-swap poly→expr→attr leaves attribute SET chrome last', () => {
    const root = mount();
    renderPolyominoDemo(root);
    renderExpressionDemo(root);
    renderAttributeDemo(root);
    expect(root.querySelector('h1')?.textContent).toMatch(/Attribute/i);
    expect(root.querySelector('#set-grid')).toBeTruthy();
    expect(root.querySelector('#board-container')).toBeFalsy();
    expect(root.querySelector('#challenge-grid')).toBeFalsy();
  });
});
