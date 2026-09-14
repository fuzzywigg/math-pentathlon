/**
 * Wave 64 leftover after tip/#303 — Sum domino divider 1px orient.
 * Soft divider tokens existed; lock horizontal width / vertical height. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 64 sum — inject divider 1px', () => {
  it('pins horizontal width 1px and vertical height 1px', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-domino-horizontal \.sd-domino-divider\s*\{[\s\S]*?width:\s*1px/
    );
    expect(css).toMatch(
      /\.sd-domino-vertical \.sd-domino-divider\s*\{[\s\S]*?height:\s*1px/
    );
  });
});
