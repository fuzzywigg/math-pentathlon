/**
 * Wave 67 leftover after tip/#316 — Sum playable cursor pointer leftover.
 * Soft selected -4 / hover lift existed; lock playable cursor + ring. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject playable cursor pointer', () => {
  it('pins hand-domino-playable cursor pointer + green ring', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-playable\s*\{[\s\S]*?cursor:\s*pointer/
    );
    expect(css).toMatch(
      /\.sd-hand-domino-playable\s*\{[\s\S]*?0 0 0 2px #4caf50/
    );
  });
});
