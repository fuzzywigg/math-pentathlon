/**
 * Wave 55 leftover after #250 — Stars injectStyles AI chrome + star glyph. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectStarsStyles } from '../../src/games/stars-bars/board-ui';

describe('Wave 55 stars — inject CSS', () => {
  it('needles for AI opponent, pulse, star glyph', () => {
    injectStarsStyles();
    const css = Array.from(document.head.querySelectorAll('style'))
      .map((n) => n.textContent ?? '')
      .join('\n');
    expect(css).toContain('[data-opponent="ai"] .stars-status.player2');
    expect(css).toContain('@keyframes pulse');
    expect(css).toContain('\\2605');
  });
});
