/**
 * Wave 61 leftover after #301 (unit-only) — Polyomino visible ← Back button text.
 * Distinct from wave56 back-btn aria matrix leftover. Tests-only.
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

describe('Wave 61 demos — poly back-btn text', () => {
  it('mounts exact ← Back visible label on #back-btn', () => {
    const root = mount();
    renderPolyominoDemo(root);
    expect(root.querySelector('#back-btn')?.textContent).toBe('← Back');
  });
});
