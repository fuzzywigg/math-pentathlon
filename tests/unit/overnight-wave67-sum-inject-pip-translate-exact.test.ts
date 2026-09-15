/**
 * Wave 67 leftover after tip/#324 — Sum sd-pip translate exact.
 * Soft 4px / #111 existed; lock translate(-50%, -50%) leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject pip translate exact', () => {
  it('pins sd-pip transform translate(-50%, -50%) leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-pip\s*\{[\s\S]*?transform:\s*translate\(-50%, -50%\)/
    );
  });
});
