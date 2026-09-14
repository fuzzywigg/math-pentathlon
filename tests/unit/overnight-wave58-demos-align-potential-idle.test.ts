/**
 * Wave 58 leftover after #267 — Align potential idle placeholder.
 * Distinct from potential cycle leftovers. Tests-only.
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

describe('Wave 58 demos — align potential idle', () => {
  it('mounts Click a cell to see alignment potential', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAlignmentDemo(root);
    expect(root.querySelector('#potential-info')?.textContent?.trim()).toBe(
      'Click a cell to see alignment potential'
    );
  });
});
