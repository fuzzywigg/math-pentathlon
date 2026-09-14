/**
 * Wave 60 leftover after #282 — Sum divider tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject divider tokens', () => {
  it('pins divider bg and axis size leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino-divider\s*\{[\s\S]*?background:\s*#333/);
    expect(css).toMatch(
      /\.sd-domino-horizontal \.sd-domino-divider\s*\{[\s\S]*?width:\s*1px/
    );
    expect(css).toMatch(
      /\.sd-domino-vertical \.sd-domino-divider\s*\{[\s\S]*?height:\s*1px/
    );
  });
});
