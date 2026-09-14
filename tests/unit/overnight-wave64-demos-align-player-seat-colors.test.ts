/**
 * Wave 64 leftover after tip/#303 (unit-only) — align player seat colors.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — align player seat colors', () => {
  it('locks player-x/b blue and player-o/r red seat colors', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.player-x, .player-b { color: #1976d2; }');
    expect(css).toContain('.player-o, .player-r { color: #d32f2f; }');
    expect(css).toContain('.winner { color: #2e7d32; font-weight: bold; }');
  });
});
