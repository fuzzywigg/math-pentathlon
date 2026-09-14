/**
 * Wave 57 leftover after #267 — Alignment demo exact h3 section titles.
 * Distinct from wave56 player span leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

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

describe('Wave 57 demos — align section titles', () => {
  it('exposes Connect Four / Hex-style / Potential Analysis h3s', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const h3 = [...root.querySelectorAll('h3')].map((el) => el.textContent ?? '');
    expect(h3).toContain('Connect Four Style (4-in-a-row)');
    expect(h3).toContain('Hex-style Connection');
    expect(h3).toContain('Alignment Potential Analysis');
  });
});
