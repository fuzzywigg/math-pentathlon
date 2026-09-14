/**
 * Wave 58 leftover after #267 — Alignment section h3 catalog.
 * Distinct from wave56 player-span leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 demos — align h3 catalog', () => {
  it('exposes Connect Four / Hex-style / Potential Analysis h3s', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAlignmentDemo(root);
    const h3s = [...root.querySelectorAll('h3')].map((h) => h.textContent?.trim());
    expect(h3s).toContain('Connect Four Style (4-in-a-row)');
    expect(h3s).toContain('Hex-style Connection');
    expect(h3s).toContain('Alignment Potential Analysis');
  });
});
