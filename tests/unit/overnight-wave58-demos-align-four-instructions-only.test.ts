/**
 * Wave 58 leftover after #267 — Align Reset Game button exact label.
 * Distinct from h1/instructions leftover. Tests-only.
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

describe('Wave 58 demos — align reset labels', () => {
  it('exposes Reset Game on four/hex/potential sections', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAlignmentDemo(root);
    expect(root.querySelector('#four-reset')?.textContent?.trim()).toBe('Reset Game');
    expect(root.querySelector('#hex-reset')?.textContent?.trim()).toBe('Reset Game');
    expect(root.querySelector('#potential-reset')?.textContent?.trim()).toBe(
      'Reset'
    );
  });
});
