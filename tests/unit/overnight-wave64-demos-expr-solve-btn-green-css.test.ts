/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr solve btn green css.
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

describe('Wave 64 demos — expr solve-btn green CSS', () => {
  it('locks solver button #4caf50 + hover #388e3c', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.solver-input button\s*\{[^}]*background:\s*#4caf50/);
    expect(css).toContain('background: #388e3c');
  });
});
