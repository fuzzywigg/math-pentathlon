/**
 * Overnight TOKENMAXX HEAVY — expression solver empty-input defaults leftover.
 * Distinct from #220 exact solutions and overnight 1,1,1,1 no-solutions. Tests-only.
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

describe('Overnight demos46 — expr solver empty defaults', () => {
  it('cleared num inputs coerce via parseInt||1 and report No solutions', () => {
    const root = mount();
    renderExpressionDemo(root);
    for (const id of ['num1', 'num2', 'num3', 'num4']) {
      (root.querySelector(`#${id}`) as HTMLInputElement).value = '';
    }
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#solutions-list')?.textContent).toMatch(
      /Searching/i
    );
    vi.advanceTimersByTime(50);
    expect(root.querySelector('#solutions-list')?.textContent).toMatch(
      /No solutions/i
    );
  });
});
