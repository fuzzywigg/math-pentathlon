/**
 * Wave 61 leftover after #301 (unit-only) — Dice quick-roll-btn hover inject CSS leftover.
 * Distinct from wave60 demos residual leftovers. Tests-only.
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

describe('Wave 61 demos — dice quickroll hover CSS', () => {
  it('locks quick-roll fill + hover darken', () => {
    const root = mount();
    renderDiceDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.quick-roll-btn {');
    expect(css).toContain('background: #1976d2');
    expect(css).toContain('.quick-roll-btn:hover {');
    expect(css).toContain('background: #1565c0');
  });
});
