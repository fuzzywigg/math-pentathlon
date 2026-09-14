/**
 * Wave 61 leftover after #301 (unit-only) — Graph player2 selected + clear hover inject CSS leftovers.
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

describe('Wave 61 demos — graph player2/clear CSS', () => {
  it('locks player2 red selected + clear hover pink', () => {
    const root = mount();
    renderGraphDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.player-btn[data-player="2"].selected {');
    expect(css).toContain('background: #f44336');
    expect(css).toContain('border-color: #f44336');
    expect(css).toContain('#clear-path-btn:hover,');
    expect(css).toContain('background: #ffebee');
  });
});
