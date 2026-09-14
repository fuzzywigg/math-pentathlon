/**
 * Wave 60 leftover after #290 (unit-only) — Dice log-area inject CSS leftovers.
 * Distinct from wave59 polyhedral h2 exact leftover. Tests-only.
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

describe('Wave 60 demos — dice log-area CSS', () => {
  it('locks log-area dark chrome + max-width 800px', () => {
    const root = mount();
    renderDiceDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('max-width: 800px');
    expect(css).toContain('background: #263238');
    expect(css).toContain('color: #4fc3f7');
    expect(css).toContain('font-family: monospace');
  });
});
