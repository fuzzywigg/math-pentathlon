/**
 * Wave 64 leftover after tip/#303 (unit-only) — dice quickroll btn blue css.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — dice quick-roll btn blue CSS', () => {
  it('locks quick-roll-btn #1976d2 fill + #1565c0 hover', () => {
    const root = mount();
    renderDiceDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.quick-roll-btn\s*\{[^}]*background:\s*#1976d2/);
    expect(css).toContain('background: #1565c0');
  });
});
