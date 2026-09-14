/**
 * Wave 64 leftover after tip/#303 (unit-only) — align h1 indigo css.
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

describe('Wave 64 demos — align h1 indigo CSS', () => {
  it('locks alignment-demo h1 #1a237e + section #f5f5f5', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('color: #1a237e');
    expect(css).toContain('background: #f5f5f5');
    expect(css).toContain('max-width: 900px');
  });
});
