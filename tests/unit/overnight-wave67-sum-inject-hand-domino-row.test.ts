/**
 * Wave 67 leftover after tip/#316 — Sum hand-domino row leftover.
 * Soft pad/cursor/size existed; lock flex-direction row leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject hand-domino row', () => {
  it('pins hand-domino flex-direction row leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino\s*\{[\s\S]*?flex-direction:\s*row/
    );
    expect(css).toMatch(
      /\.sd-hand-domino\s*\{[\s\S]*?transition:\s*all 0\.15s ease/
    );
  });
});
