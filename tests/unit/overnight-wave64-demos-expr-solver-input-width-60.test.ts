/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr solver input width 60.
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

describe('Wave 64 demos — expr solver input width 60', () => {
  it('locks .solver-input input width 60px + media 50px', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('width: 60px');
    expect(css).toContain('@media (max-width: 600px)');
    expect(css).toContain('width: 50px');
  });
});
