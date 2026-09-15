/**
 * Wave 67 leftover after tip/#324 (unit-only) — align reset btn blue.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — align reset-btn blue css', () => {
  it('locks .demo-reset-btn background #1976d2', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.demo-reset-btn');
    expect(css).toContain('background: #1976d2');
  });
});
