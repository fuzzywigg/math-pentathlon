/**
 * Wave 61 leftover after #301 (unit-only) — Attribute compare-slot dashed inject CSS leftovers.
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

describe('Wave 61 demos — attr compare-slot CSS', () => {
  it('locks 100x100 dashed compare slots', () => {
    const root = mount();
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain('width: 100px');
    expect(css).toContain('height: 100px');
    expect(css).toContain('border: 2px dashed #ccc');
  });
});
