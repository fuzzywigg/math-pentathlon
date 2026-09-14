/**
 * Wave 61 leftover after #301 (unit-only) — Align demo wrapper max-width + h1 color.
 * Distinct from wave60 idle status leftovers. Tests-only.
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

describe('Wave 61 demos — align wrapper CSS', () => {
  it('locks alignment-demo max-width 900px and h1 #1a237e', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('max-width: 900px');
    expect(css).toContain('color: #1a237e');
  });
});
