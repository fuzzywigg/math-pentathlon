/**
 * Wave 64 leftover after tip/#303 (unit-only) — poly shape item selected css.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — poly shape-item selected CSS', () => {
  it('locks .shape-item.selected #bbdefb / #1976d2 border', () => {
    const root = mount();
    renderPolyominoDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.shape-item\.selected\s*\{[^}]*background:\s*#bbdefb/);
    expect(css).toMatch(/\.shape-item\.selected\s*\{[^}]*border-color:\s*#1976d2/);
  });
});
