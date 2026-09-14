/**
 * Wave 61 leftover after #301 (unit-only) — Graph display min-height + analysis grid inject CSS leftovers.
 * Distinct from wave60 demos residual leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

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

describe('Wave 61 demos — graph display/grid CSS', () => {
  it('locks graph-display min-height + analysis minmax grid', () => {
    const root = mount();
    renderGraphDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('min-height: 200px');
    expect(css).toContain('grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))');
    expect(css).toContain('color: #555');
  });
});
