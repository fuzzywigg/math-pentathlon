/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact answer-box dashed border.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — answer-box dashed', () => {
  it('includes dashed #ccc border leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('border: 3px dashed #ccc');
  });
});
