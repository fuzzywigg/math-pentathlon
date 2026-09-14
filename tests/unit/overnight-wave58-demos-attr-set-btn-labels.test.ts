/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Attribute set-btn exact labels.
 * Distinct from data-set selected-class leftovers. Tests-only.
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

describe('Wave 58 demos — attr set-btn labels', () => {
  it('exposes Basic (Shape/Color/Size) and Math Properties labels', () => {
    const root = mount();
    renderAttributeDemo(root);
    const labels = [...root.querySelectorAll('.set-btn')].map(
      (b) => b.textContent?.trim() ?? ''
    );
    expect(labels).toContain('Basic (Shape/Color/Size)');
    expect(labels).toContain('Math Properties');
  });
});
