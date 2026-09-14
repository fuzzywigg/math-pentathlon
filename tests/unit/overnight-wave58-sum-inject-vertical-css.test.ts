/**
 * Wave 58 leftover after #267 — Sum vertical domino flex CSS body.
 * Distinct from wave57 placed-vertical class leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

beforeEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — inject vertical CSS', () => {
  it('embeds .sd-domino-vertical flex-direction column', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino-vertical/);
    expect(css).toMatch(/flex-direction:\s*column/);
  });
});
