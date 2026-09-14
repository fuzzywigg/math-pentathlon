/**
 * Wave 61 leftover after #301 (unit-only) — Align potential at (r, c) exact prefix.
 * Distinct from wave59 idle Click a cell leftover. Tests-only.
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

describe('Wave 61 demos — align potential-at prefix', () => {
  it('clicking (0,0) paints Alignment potential at (0, 0):', () => {
    const root = mount();
    renderAlignmentDemo(root);
    (
      root.querySelector(
        '#potential-board .demo-cell[data-row="0"][data-col="0"]'
      ) as HTMLElement
    ).click();
    const info = root.querySelector('#potential-info')?.textContent ?? '';
    expect(info.startsWith('Alignment potential at (0, 0):')).toBe(true);
  });
});
