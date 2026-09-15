/**
 * Wave 67 leftover after tip/#324 (unit-only) — graph clear margin-left auto.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — graph clear-btn margin-left auto', () => {
  it('locks clear path/game margin-left auto', () => {
    const root = mount();
    renderGraphDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('margin-left: auto');
    expect(css).toContain('#clear-path-btn');
    expect(css).toContain('#clear-game-btn');
  });
});
