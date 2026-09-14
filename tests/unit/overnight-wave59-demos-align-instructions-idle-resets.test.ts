/**
 * Wave 59 leftover after #281 — Align instructions / potential idle / reset labels.
 * Distinct from wave58 h3 catalog + Winner: Blue! leftovers. Tests-only.
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

describe('Wave 59 demos — align instructions idle resets', () => {
  it('locks four/hex instructions, potential idle, tagline, and resets', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAlignmentDemo(root);
    const instr = [...root.querySelectorAll('.demo-instructions')].map(
      (p) => p.textContent?.trim()
    );
    expect(instr).toContain(
      'Click a column to drop a piece. Get 4 in a row to win!'
    );
    expect(instr).toContain(
      'Blue connects top-bottom, Red connects left-right. Click to place.'
    );
    expect(root.querySelector('#potential-info')?.textContent?.trim()).toBe(
      'Click a cell to see alignment potential'
    );
    const paras = [...root.querySelectorAll('p')].map((p) => p.textContent?.trim());
    expect(paras).toContain('Test the reusable alignment detection system');
    expect(root.querySelector('#four-reset')?.textContent?.trim()).toBe('Reset Game');
    expect(root.querySelector('#hex-reset')?.textContent?.trim()).toBe('Reset Game');
    expect(root.querySelector('#potential-reset')?.textContent?.trim()).toBe('Reset');
  });
});
