/**
 * Wave 68 leftover after tip/#337 — Sum board padding 8px.
 * Soft radius/shadow existed; lock padding leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject board padding 8', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?padding:\s*8px/);
  });
});
