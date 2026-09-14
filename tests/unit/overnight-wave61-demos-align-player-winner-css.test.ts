/**
 * Wave 61 leftover after #301 (unit-only) — Alignment player span / winner inject CSS leftovers.
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

describe('Wave 61 demos — align player/winner CSS', () => {
  it('locks player-x/o colors and winner bold green', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.player-x, .player-b { color: #1976d2; }');
    expect(css).toContain('.player-o, .player-r { color: #d32f2f; }');
    expect(css).toContain('.winner { color: #2e7d32; font-weight: bold; }');
  });
});
