/**
 * Wave 61 leftover after #301 (unit-only) — Attribute placeholder italic inject CSS leftover.
 * Distinct from wave60 demos residual leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

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

describe('Wave 61 demos — attr placeholder italic CSS', () => {
  it('locks .placeholder italic gray chrome', () => {
    const root = mount();
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('.placeholder {');
    expect(css).toContain('color: #999');
    expect(css).toContain('font-style: italic');
  });
});
