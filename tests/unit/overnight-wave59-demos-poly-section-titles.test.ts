/**
 * Wave 59 leftover after #281 (unit-only) — Polyomino lower-section h2 titles.
 * Distinct from wave56 Unique Orientations leftovers. Tests-only.
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

describe('Wave 59 demos — poly section titles', () => {
  it('exposes Rotation / Placement / Shape Info h2s', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Shape Rotation & Flip');
    expect(h2).toContain('Placement Demo');
    expect(h2).toContain('Shape Info');
  });
});
