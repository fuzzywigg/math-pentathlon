/**
 * Wave 59 leftover after #272 — Frac Fact inject status.player1 color var.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject status-p1-color-var', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(
      /\.frac-status\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1,\s*#1565c0\)/
    );
  });
});
