/**
 * Wave 59 leftover after #272 — Frac Fact inject player-score #f5f5f5.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject player-score-fill', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-player-score\s*\{[\s\S]*?background:\s*#f5f5f5/);
  });
});
