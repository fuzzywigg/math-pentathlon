/**
 * Wave 64 leftover after tip/#303 (unit-only) — align selected cell purple.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

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

describe('Wave 64 demos — align selected-cell purple', () => {
  it('locks .selected-cell purple border + box-shadow', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('border-color: #9c27b0');
    expect(css).toContain('box-shadow: 0 0 8px rgba(156, 39, 176, 0.4)');
  });
});
