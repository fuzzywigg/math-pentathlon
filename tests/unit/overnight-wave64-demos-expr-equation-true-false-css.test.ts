/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr equation true false css.
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

describe('Wave 64 demos — expr equation true/false CSS', () => {
  it('locks #equation-result.true/.false palette', () => {
    const root = mount();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('#equation-result.true');
    expect(css).toContain('#equation-result.false');
    expect(css).toContain('background: #e8f5e9');
    expect(css).toContain('background: #ffebee');
    expect(css).toContain('color: #c62828');
  });
});
