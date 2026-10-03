/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr try span exact.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 64 demos — expr Try: span exact', () => {
  it('locks example-expressions Try: span', () => {
    const root = mount();
    renderExpressionDemo(root);
    expect(
      root.querySelector('.example-expressions > span')?.textContent
    ).toBe('Try:');
  });
});
