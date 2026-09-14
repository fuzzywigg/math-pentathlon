/**
 * Overnight HEAVY leftover after #256 — injectPolyominoStyles idempotent.
 * Distinct from wave53 drag hover / wave52 noflip controls. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPolyominoStyles } from '../../src/core/polyomino';

afterEach(() => {
  document.getElementById('polyomino-styles')?.remove();
});

describe('Wave 56 core poly-ui — inject styles idempotent', () => {
  it('second inject leaves a single style tag', () => {
    injectPolyominoStyles();
    injectPolyominoStyles();
    expect(document.querySelectorAll('#polyomino-styles').length).toBe(1);
    const css = document.getElementById('polyomino-styles')?.textContent ?? '';
    expect(css).toMatch(/\.draggable-shape:active/);
    expect(css).toMatch(/pulse-valid/);
  });
});
