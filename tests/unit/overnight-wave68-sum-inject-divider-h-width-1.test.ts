/**
 * Wave 68 leftover after tip/#337 — Sum horizontal divider width 1px.
 * Soft divider tokens existed; lock horizontal width leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject divider h width 1', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-domino-horizontal \.sd-domino-divider\s*\{[\s\S]*?width:\s*1px/
    );
  });
});
