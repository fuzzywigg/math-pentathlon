/**
 * Wave 67 leftover after tip/#324 (unit-only) — dice log fontsize.
 * Distinct from wave64 demos residual leftovers (#311). Tests-only.
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

describe('Wave 67 demos — dice log-area font-size 0.85rem', () => {
  it('locks .log-area font-size 0.85rem', () => {
    const root = mount();
    renderDiceDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('font-size: 0.85rem');
  });
});
