/**
 * Wave 67 leftover after tip/#316 — Sum domino-face relative leftover.
 * Soft pip/divider existed; lock position relative + flex 1. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject domino-face relative', () => {
  it('pins sd-domino-face position relative + flex 1', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-domino-face\s*\{[\s\S]*?position:\s*relative/
    );
    expect(css).toMatch(/\.sd-domino-face\s*\{[\s\S]*?flex:\s*1/);
  });
});
