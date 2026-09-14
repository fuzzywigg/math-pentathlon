/**
 * Wave 60 leftover after #290 (unit-only) — Expr Courier New monospace inject CSS.
 * Distinct from wave59 calc/check label leftovers. Tests-only.
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

describe('Wave 60 demos — expr Courier New font', () => {
  it('demo style block locks Courier New monospace', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain("font-family: 'Courier New', monospace");
    expect(css).toContain('max-width: 900px');
  });
});
