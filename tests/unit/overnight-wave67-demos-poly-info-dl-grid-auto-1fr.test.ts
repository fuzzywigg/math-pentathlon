/**
 * Wave 67 leftover after tip/#324 (unit-only) — poly info dl grid.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — poly shape-info dl auto 1fr', () => {
  it('locks .shape-info dl grid-template-columns auto 1fr', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.shape-info dl');
    expect(css).toContain('grid-template-columns: auto 1fr');
  });
});
