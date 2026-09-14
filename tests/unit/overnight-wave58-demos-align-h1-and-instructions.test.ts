/**
 * Wave 58 leftover after #267 — Align h1 + four-in-a-row instructions.
 * Distinct from wave56 status spans leftover. Tests-only.
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

describe('Wave 58 demos — align h1 + instructions', () => {
  it('mounts exact h1 and Connect Four instruction copy', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAlignmentDemo(root);
    expect(root.querySelector('h1')?.textContent?.trim()).toBe(
      '🔗 Alignment Detection Demo'
    );
    expect(root.querySelector('.demo-instructions')?.textContent?.trim()).toBe(
      'Click a column to drop a piece. Get 4 in a row to win!'
    );
  });
});
