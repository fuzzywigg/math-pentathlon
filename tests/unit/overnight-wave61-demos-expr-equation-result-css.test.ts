/**
 * Wave 61 leftover after #301 (unit-only) — Expression equation-result true/false inject CSS leftovers.
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

describe('Wave 61 demos — expr equation-result CSS', () => {
  it('locks #equation-result.true / .false verdict chrome', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('#equation-result.true {');
    expect(css).toContain('background: #e8f5e9');
    expect(css).toContain('color: #2e7d32');
    expect(css).toContain('#equation-result.false {');
    expect(css).toContain('background: #ffebee');
    expect(css).toContain('color: #c62828');
  });
});
