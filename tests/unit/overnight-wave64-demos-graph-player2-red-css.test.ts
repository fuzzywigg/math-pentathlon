/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph player2 red css.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — graph player2 red selected CSS', () => {
  it('locks player-btn[data-player="2"].selected #f44336', () => {
    const root = mount();
    renderGraphDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain(
      '.player-btn[data-player="2"].selected'
    );
    expect(css).toMatch(
      /\.player-btn\[data-player="2"\]\.selected\s*\{[^}]*background:\s*#f44336/
    );
  });
});
