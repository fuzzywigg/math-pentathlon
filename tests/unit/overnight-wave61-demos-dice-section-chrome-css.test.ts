/**
 * Wave 61 leftover after #301 (unit-only) — Dice section h2 border + result/log inject CSS leftovers.
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

describe('Wave 61 demos — dice section chrome CSS', () => {
  it('locks h2 border-bottom, result min-height, log font-size', () => {
    const root = mount();
    renderDiceDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('border-bottom: 2px solid #ddd');
    expect(css).toContain('min-height: 80px');
    expect(css).toContain('font-size: 0.85rem');
    expect(css).toContain('max-height: 200px');
  });
});
