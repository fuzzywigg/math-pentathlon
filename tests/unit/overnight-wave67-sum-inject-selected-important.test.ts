/**
 * Wave 67 leftover after tip/#324 — Sum selected box-shadow !important.
 * Soft 0 0 0 3px / translateY(-4px) existed; lock !important leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject selected important', () => {
  it('pins selected box-shadow 3px #ff9800 !important leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-selected\s*\{[\s\S]*?box-shadow:\s*0 0 0 3px #ff9800 !important/
    );
  });
});
