/**
 * Wave 58 leftover after #267 — Attribute section h2 catalog.
 * Distinct from set-btn leftover. Tests-only.
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

describe('Wave 58 demos — attr section h2s', () => {
  it('exposes Pieces/SET Cards/Comparison/Filtering h2s', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Attribute Pieces');
    expect(h2s).toContain('SET Game Cards');
    expect(h2s).toContain('Piece Comparison');
    expect(h2s).toContain('Attribute Filtering');
  });
});
