/**
 * Wave 59 leftover after #281 (unit-only) — Expression solver Searching... interim copy.
 * Distinct from wave56 No solutions found leftovers. Tests-only.
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

describe('Wave 59 demos — expr Searching exact', () => {
  it('paints exact Searching... before solver timeout resolves', () => {
    const root = mount();
    renderExpressionDemo(root);
    (root.querySelector('#solve-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#solutions-list')?.textContent).toBe('Searching...');
    vi.runAllTimers();
  });
});
