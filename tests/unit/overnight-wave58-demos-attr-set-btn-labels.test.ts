/**
 * Wave 58 leftover after #267 — Attribute set-btn exact labels.
 * Distinct from wave56 Select N cards / tip leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — attr set-btn labels', () => {
  it('exposes Basic (Shape/Color/Size) and Math Properties', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    expect(
      root.querySelector('.set-btn[data-set="basic"]')?.textContent?.trim()
    ).toBe('Basic (Shape/Color/Size)');
    expect(
      root.querySelector('.set-btn[data-set="math"]')?.textContent?.trim()
    ).toBe('Math Properties');
  });
});
