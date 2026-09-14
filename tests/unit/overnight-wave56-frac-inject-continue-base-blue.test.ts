/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact continue base blue.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — continue base blue', () => {
  it('continue-btn base background is #2196F3 leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-continue-btn');
    expect(css).toContain('background: #2196F3');
  });
});
