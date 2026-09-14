/**
 * Wave 61 leftover after #301 (unit-only) — Dice h1 emoji + inject color leftover.
 * Distinct from wave60 log-area CSS leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';

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

describe('Wave 61 demos — dice h1 emoji CSS', () => {
  it('mounts 🎲 Dice System Demo with h1 color #1a237e', () => {
    const root = mount();
    renderDiceDemo(root);
    expect(root.querySelector('h1')?.textContent).toBe('🎲 Dice System Demo');
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.dice-demo h1');
    expect(css).toContain('color: #1a237e');
  });
});
