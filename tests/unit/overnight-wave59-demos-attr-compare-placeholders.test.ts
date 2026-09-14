/**
 * Wave 59 leftover after #281 (unit-only) — Attribute compare slot placeholders exact.
 * Distinct from soft overnight-demo-attribute-filter-set leftovers. Tests-only.
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

describe('Wave 59 demos — attr compare placeholders', () => {
  it('exposes exact Piece 1 / Piece 2 / Select pieces to compare', () => {
    const root = mount();
    renderAttributeDemo(root);
    expect(
      root.querySelector('#compare-piece-1 .placeholder')?.textContent
    ).toBe('Piece 1');
    expect(
      root.querySelector('#compare-piece-2 .placeholder')?.textContent
    ).toBe('Piece 2');
    expect(
      root.querySelector('#comparison-results .placeholder')?.textContent
    ).toBe('Select pieces to compare');
  });
});
