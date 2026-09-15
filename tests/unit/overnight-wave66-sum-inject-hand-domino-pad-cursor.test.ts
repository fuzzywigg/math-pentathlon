/**
 * Wave 66 leftover after tip/#316 — Sum hand-domino pad/cursor leftover.
 * Soft hand-domino size existed; lock padding 2px + cursor default. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 66 sum — inject hand-domino pad cursor', () => {
  it('pins hand-domino padding 2px + cursor default leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?padding:\s*2px/);
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?cursor:\s*default/);
  });
});
