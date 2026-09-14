/**
 * Wave 61 leftover after #301 (unit-only) — Expression solutions-list / solution-item inject CSS leftovers.
 * Distinct from wave60 demos residual leftovers. Tests-only.
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

describe('Wave 61 demos — expr solutions-list CSS', () => {
  it('locks solutions max-height + exact solution-item green', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('max-height: 300px');
    expect(css).toContain('.solution-item.exact {');
    expect(css).toContain('color: #2e7d32');
    expect(css).toContain('border-bottom: 1px solid #eee');
  });
});
