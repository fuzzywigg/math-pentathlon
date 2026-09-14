/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum divider axes CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject divider axes', () => {
  it('horizontal/vertical divider thickness leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-domino-horizontal .sd-domino-divider');
    expect(css).toContain('width: 1px');
    expect(css).toContain('.sd-domino-vertical .sd-domino-divider');
    expect(css).toContain('height: 1px');
  });
});
