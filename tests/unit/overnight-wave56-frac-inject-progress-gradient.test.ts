/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact progress-fill gradient.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — progress gradient', () => {
  it('progress-fill uses blue-to-green gradient leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain(
      'linear-gradient(90deg, #2196F3, #4caf50)'
    );
  });
});
