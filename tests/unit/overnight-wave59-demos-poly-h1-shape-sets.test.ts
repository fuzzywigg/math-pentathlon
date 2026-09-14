/**
 * Wave 59 leftover after #281 (unit-only) — Polyomino h1 + Shape Sets catalog.
 * Distinct from wave58 Current orientation leftovers. Tests-only.
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

describe('Wave 59 demos — poly h1 shape sets', () => {
  it('exposes Polyomino System Demo h1 and set-btn catalog', () => {
    const root = mount();
    renderPolyominoDemo(root);
    expect(root.querySelector('h1')?.textContent).toBe('Polyomino System Demo');
    expect(
      [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '')
    ).toContain('Shape Sets');
    const labels = [...root.querySelectorAll('.set-btn')].map(
      (el) => el.textContent ?? ''
    );
    expect(labels).toContain('Tetrominoes (4)');
    expect(labels).toContain('Pentominoes (5)');
    expect(labels).toContain('Simple (1-3)');
    expect(labels).toContain('Pattern Blocks');
  });
});
