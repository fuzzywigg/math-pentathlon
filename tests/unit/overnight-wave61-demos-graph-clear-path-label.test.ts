/**
 * Wave 61 leftover after #301 (unit-only) — Graph pathfinding Clear button label.
 * Distinct from wave59 Clear Board leftover. Tests-only.
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

describe('Wave 61 demos — graph clear-path label', () => {
  it('mounts exact Clear on #clear-path-btn', () => {
    const root = mount();
    renderGraphDemo(root);
    expect(root.querySelector('#clear-path-btn')?.textContent).toBe('Clear');
  });
});
