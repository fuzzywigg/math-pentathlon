/**
 * Wave 60 leftover after #290 (unit-only) — Graph section support paragraphs.
 * Distinct from wave59 lower-section titles leftover. Tests-only.
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

describe('Wave 60 demos — graph section paras', () => {
  it('exposes exact graph section support paragraphs', () => {
    const root = mount();
    renderGraphDemo(root);
    const paras = [...root.querySelectorAll('.demo-section > p')].map(
      (el) => el.textContent ?? ''
    );
    expect(paras).toContain(
      'Pre-built graph structures for different game types'
    );
    expect(paras).toContain(
      'Click two nodes to find the shortest path between them'
    );
    expect(paras).toContain(
      'Click to claim nodes for Player 1 (blue) or Player 2 (red)'
    );
    expect(paras).toContain(
      'Analyze graph properties and player territories'
    );
  });
});
