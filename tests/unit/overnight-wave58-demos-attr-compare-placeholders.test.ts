/**
 * Wave 58 leftover after #267 — Attribute compare placeholders.
 * Distinct from section h2 leftover. Tests-only.
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

describe('Wave 58 demos — attr compare placeholders', () => {
  it('mounts Piece 1 and Select pieces to compare', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    const text = root.textContent ?? '';
    expect(text).toMatch(/Piece 1/);
    expect(text).toMatch(/Select pieces to compare/);
  });
});
