/**
 * Wave 59 leftover after #281 (unit-only) — Alignment potential click status exact.
 * Distinct from wave58 h3 leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 59 demos — align potential click copy', () => {
  it('exposes exact Click a cell to see alignment potential', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    expect(root.querySelector('#potential-info')?.textContent).toBe(
      'Click a cell to see alignment potential'
    );
  });
});
