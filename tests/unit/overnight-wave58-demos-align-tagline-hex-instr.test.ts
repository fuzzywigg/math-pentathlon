/**
 * Wave 58 leftover after #267 — Align tagline + hex instructions.
 * Distinct from h1/four-instructions leftover. Tests-only.
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

describe('Wave 58 demos — align tagline + hex instructions', () => {
  it('exposes tagline and Blue/Red hex instruction copy', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAlignmentDemo(root);
    const paras = [...root.querySelectorAll('p')].map((p) => p.textContent?.trim());
    expect(paras).toContain('Test the reusable alignment detection system');
    const instr = [...root.querySelectorAll('.demo-instructions')].map(
      (p) => p.textContent?.trim()
    );
    expect(instr).toContain(
      'Blue connects top-bottom, Red connects left-right. Click to place.'
    );
  });
});
