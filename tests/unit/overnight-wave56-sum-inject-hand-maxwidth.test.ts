/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum hand max-width CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject hand maxwidth', () => {
  it('hand max-width + translucent pad leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-hand');
    expect(css).toContain('max-width: 300px');
    expect(css).toContain('rgba(255,255,255,0.1)');
  });
});
