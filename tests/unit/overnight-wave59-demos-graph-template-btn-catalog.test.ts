/**
 * Wave 59 leftover after #281 (unit-only) — Graph template button exact catalog.
 * Distinct from wave58 h1/Templates leftovers. Tests-only.
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

describe('Wave 59 demos — graph template btn catalog', () => {
  it('exposes exact template button labels', () => {
    const root = mount();
    renderGraphDemo(root);
    const labels = [...root.querySelectorAll('.template-btn')].map(
      (el) => el.textContent ?? ''
    );
    expect(labels).toContain('4x4 Grid');
    expect(labels).toContain('Circular (8)');
    expect(labels).toContain('Star (6)');
    expect(labels).toContain('Hex Lattice');
    expect(labels).toContain('Track (10)');
    expect(labels).toContain('Complete (5)');
  });
});
