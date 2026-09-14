/**
 * Overnight demos leftover — back navigation races + hash/back coexistence.
 * Existing demo render + router.navigate stubs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';
import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
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
  vi.restoreAllMocks();
});

const NAV_DEMOS: Array<{
  name: string;
  render: (el: HTMLElement) => void;
}> = [
  { name: 'graph', render: renderGraphDemo },
  { name: 'expression', render: renderExpressionDemo },
  { name: 'attribute', render: renderAttributeDemo },
  { name: 'fraction', render: renderFractionDemo },
  { name: 'polyomino', render: renderPolyominoDemo },
];

describe('Overnight demos — back nav race', () => {
  it.each(NAV_DEMOS)(
    '$name back button calls navigate home once per click',
    ({ render }) => {
      const root = mount();
      render(root);
      const back = root.querySelector('#back-btn') as HTMLButtonElement;
      expect(back).toBeTruthy();
      back.click();
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith('/');
    }
  );

  it.each(NAV_DEMOS)(
    '$name rapid triple-click stacks three navigate calls',
    ({ render }) => {
      const root = mount();
      render(root);
      const back = root.querySelector('#back-btn') as HTMLButtonElement;
      back.click();
      back.click();
      back.click();
      expect(navigate).toHaveBeenCalledTimes(3);
      expect(navigate).toHaveBeenNthCalledWith(1, '/');
      expect(navigate).toHaveBeenNthCalledWith(3, '/');
    }
  );

  it('dice demo uses hash back-link without navigate()', () => {
    const root = mount();
    renderDiceDemo(root);
    const link = root.querySelector('.back-link') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('#/');
    expect(root.querySelector('#back-btn')).toBeNull();
    link.click();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('alignment demo remount after navigate still exposes back chrome', () => {
    const root = mount();
    renderAlignmentDemo(root);
    // alignment uses .back-link like dice (href), not #back-btn
    const link = root.querySelector(
      '.back-link, #back-btn, a[href="#/"]'
    ) as HTMLElement;
    expect(link).toBeTruthy();
    renderGraphDemo(root);
    (root.querySelector('#back-btn') as HTMLButtonElement).click();
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('sequential demo swaps keep independent back handlers', () => {
    const root = mount();
    for (const { render } of NAV_DEMOS) {
      vi.clearAllMocks();
      render(root);
      (root.querySelector('#back-btn') as HTMLButtonElement).click();
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith('/');
    }
  });

  it('concurrent remount mid-click does not throw', () => {
    const root = mount();
    renderFractionDemo(root);
    const back = root.querySelector('#back-btn') as HTMLButtonElement;
    expect(() => {
      back.click();
      renderExpressionDemo(root);
      (root.querySelector('#back-btn') as HTMLButtonElement).click();
    }).not.toThrow();
    expect(navigate).toHaveBeenCalledTimes(2);
  });
});
