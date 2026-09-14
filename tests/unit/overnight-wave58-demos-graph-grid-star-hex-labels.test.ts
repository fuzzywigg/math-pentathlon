/**
 * Wave 58 leftover after #267 — Graph Grid/Star/Hex template labels.
 * Distinct from Circular/Track/Complete leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — graph grid/star/hex labels', () => {
  it('exacts 4x4 Grid / Star (6) / Hex Lattice labels', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderGraphDemo(root);
    expect(
      root.querySelector('.template-btn[data-template="grid"]')?.textContent?.trim()
    ).toBe('4x4 Grid');
    expect(
      root.querySelector('.template-btn[data-template="star"]')?.textContent?.trim()
    ).toBe('Star (6)');
    expect(
      root.querySelector('.template-btn[data-template="hex"]')?.textContent?.trim()
    ).toBe('Hex Lattice');
  });
});
