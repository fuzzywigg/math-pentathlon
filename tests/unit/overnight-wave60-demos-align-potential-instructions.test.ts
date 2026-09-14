/**
 * Wave 60 leftover after #290 (unit-only) — Align potential instructions exact.
 * Distinct from wave59 four/hex instructions + potential idle info. Tests-only.
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

describe('Wave 60 demos — align potential instructions', () => {
  it('exposes exact Click cells to place X potential instructions', () => {
    const root = mount();
    renderAlignmentDemo(root);
    const instr = [...root.querySelectorAll('.demo-instructions')].map(
      (el) => el.textContent ?? ''
    );
    expect(instr).toContain(
      'Click cells to place X. See alignment potential for each direction.'
    );
  });
});
