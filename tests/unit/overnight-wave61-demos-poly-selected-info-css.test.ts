/**
 * Wave 61 leftover after #301 (unit-only) — Poly selected-shape + shape-info dl inject CSS leftovers.
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

describe('Wave 61 demos — poly selected/info CSS', () => {
  it('locks 150px selected display + info dl auto/1fr grid', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('min-width: 150px');
    expect(css).toContain('min-height: 150px');
    expect(css).toContain('grid-template-columns: auto 1fr');
    expect(css).toContain('gap: 5px 15px');
  });
});
