/**
 * Wave 59 leftover after #281 (unit-only) — Attribute demo exact h2 section catalog.
 * Distinct from wave58 h1 + set-btn leftovers. Tests-only.
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

describe('Wave 59 demos — attr section h2 catalog', () => {
  it('exposes Attribute Pieces / SET / Comparison / Filtering h2s', () => {
    const root = mount();
    renderAttributeDemo(root);
    const h2 = [...root.querySelectorAll('h2')].map((el) => el.textContent ?? '');
    expect(h2).toContain('Attribute Pieces');
    expect(h2).toContain('SET Game Cards');
    expect(h2).toContain('Piece Comparison');
    expect(h2).toContain('Attribute Filtering');
  });
});
