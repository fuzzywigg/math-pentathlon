/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact inject CSS btn-secondary.
 * Wave54 sampled primary + AI seat, not secondary/controls. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 55 frac inject — btn-secondary / controls', () => {
  it('stylesheet includes secondary button and controls leftovers', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-btn-secondary');
    expect(css).toContain('.frac-controls');
    expect(css).toContain('.frac-game-container');
    expect(css).toContain('max-width: 800px');
  });
});
