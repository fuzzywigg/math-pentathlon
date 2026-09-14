/**
 * Wave 59 leftover after #281 — Attribute section h2s + compare placeholders.
 * Distinct from wave58 Attribute Logic Demo h1 / set-btn leftovers. Tests-only.
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

describe('Wave 59 demos — attr h2s + compare placeholders', () => {
  it('exposes SET/Comparison/Filtering h2s and Piece 1 placeholders', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    const h2s = [...root.querySelectorAll('h2')].map((h) => h.textContent?.trim());
    expect(h2s).toContain('Attribute Pieces');
    expect(h2s).toContain('SET Game Cards');
    expect(h2s).toContain('Piece Comparison');
    expect(h2s).toContain('Attribute Filtering');
    const placeholders = [...root.querySelectorAll('.placeholder')].map(
      (s) => s.textContent?.trim()
    );
    expect(placeholders).toContain('Piece 1');
    expect(placeholders).toContain('Select pieces to compare');
  });
});
