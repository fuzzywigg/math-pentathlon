/**
 * Overnight TOKENMAXX HEAVY — demos back-nav matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { navigate } from '../../src/core/router';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderDiceDemo } from '../../src/demos/dice-demo';

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
});

describe('Overnight demos — back navigation matrix', () => {
  it('#back-btn demos call navigate("/")', () => {
    const root = mount();
    const withBack = [
      renderAttributeDemo,
      renderExpressionDemo,
      renderFractionDemo,
      renderGraphDemo,
      renderPolyominoDemo,
    ];
    for (const render of withBack) {
      vi.clearAllMocks();
      render(root);
      (root.querySelector('#back-btn') as HTMLButtonElement).click();
      expect(navigate).toHaveBeenCalledWith('/');
    }
  });

  it('alignment + dice expose hash back links to home', () => {
    const root = mount();
    renderAlignmentDemo(root);
    expect(root.querySelector('.back-link')?.getAttribute('href')).toBe('#/');
    renderDiceDemo(root);
    expect(root.querySelector('.back-link')?.getAttribute('href')).toBe('#/');
  });
});
