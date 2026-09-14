/**
 * Wave 61 leftover after #301 (unit-only) — Alignment winning-cell / selected-cell inject CSS leftovers.
 * Distinct from wave60 demos residual leftovers. Tests-only.
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

describe('Wave 61 demos — align win/selected CSS', () => {
  it('locks winning glow + selected purple chrome', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('box-shadow: 0 0 10px rgba(76, 175, 80, 0.5)');
    expect(css).toContain('border-color: #9c27b0');
    expect(css).toContain('box-shadow: 0 0 8px rgba(156, 39, 176, 0.4)');
    expect(css).toContain('@keyframes pulse-winner');
  });
});
