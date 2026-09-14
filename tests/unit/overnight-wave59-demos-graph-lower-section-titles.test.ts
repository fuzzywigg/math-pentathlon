/**
 * Wave 59 leftover after #281 (unit-only) — Graph lower-section h2 titles.
 * Distinct from wave58 Templates/Pathfinding leftovers. Tests-only.
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

describe('Wave 59 demos — graph lower section titles', () => {
  it('exposes Interactive Game Board and Connectivity Analysis h2s', () => {
    const root = mount();
    renderGraphDemo(root);
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Interactive Game Board');
    expect(h2).toContain('Connectivity Analysis');
  });
});
