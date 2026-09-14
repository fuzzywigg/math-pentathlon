/**
 * Wave 60 leftover after #290 (unit-only) — Polyomino section support paragraphs.
 * Distinct from wave59 section titles leftover. Tests-only.
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

describe('Wave 60 demos — poly section paras', () => {
  it('exposes exact polyomino section support paragraphs', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const paras = [...root.querySelectorAll('.demo-section > p')].map(
      (el) => el.textContent ?? ''
    );
    expect(paras).toContain('Select a polyomino set to explore');
    expect(paras).toContain('Select a shape and use controls to rotate/flip');
    expect(paras).toContain('Click the board to place the selected shape');
  });
});
