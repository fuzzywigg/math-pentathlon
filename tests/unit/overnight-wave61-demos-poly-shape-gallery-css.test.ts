/**
 * Wave 61 leftover after #301 (unit-only) — Poly shape-gallery / shape-item inject CSS leftovers.
 * Distinct from wave60 demos residual leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';

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

describe('Wave 61 demos — poly shape-gallery CSS', () => {
  it('locks gallery gap/padding + transparent/selected borders', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('gap: 15px');
    expect(css).toContain('padding: 15px');
    expect(css).toContain('border: 2px solid transparent');
    expect(css).toContain('.shape-item.selected {');
    expect(css).toContain('background: #bbdefb');
    expect(css).toContain('border-color: #1976d2');
  });
});
