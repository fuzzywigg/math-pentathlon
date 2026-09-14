/**
 * Wave 56 leftover after #256 — Expression solver exact No solutions found copy.
 * Distinct from soft /No solutions/i leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

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

describe('Wave 56 demos — expr No solutions exact', () => {
  it('settles to exact No solutions found for these numbers.', () => {
    const root = mount();
    renderExpressionDemo(root);
    for (const id of ['num1', 'num2', 'num3', 'num4']) {
      (root.querySelector(`#${id}`) as HTMLInputElement).value = '1';
    }
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    vi.advanceTimersByTime(50);
    expect(root.querySelector('#solutions-list')?.textContent?.trim()).toBe(
      'No solutions found for these numbers.'
    );
  });
});
