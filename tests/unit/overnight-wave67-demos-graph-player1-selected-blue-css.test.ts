/**
 * Wave 67 leftover after tip/#324 (unit-only) — graph player1 selected blue.
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

describe('Wave 67 demos — graph player1 selected blue', () => {
  it('locks player1 selected #2196f3', () => {
    const root = mount();
    renderGraphDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.player-btn[data-player="1"].selected');
    expect(css).toMatch(/\.player-btn\[data-player="1"\]\.selected\s*\{[^}]*background:\s*#2196f3/);
  });
});
