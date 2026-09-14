/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum board palette CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject board palette', () => {
  it('board green palette + 22px cells leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('#2d5a27');
    expect(css).toContain('#3d7a37');
    expect(css).toContain('#1a3a17');
    expect(css).toContain('width: 22px');
    expect(css).toContain('height: 22px');
  });
});
