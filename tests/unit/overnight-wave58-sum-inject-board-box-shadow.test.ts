/**
 * Wave 58 leftover after #275 — Sum inject board box-shadow. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — inject board box-shadow', () => {
  it('pins leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('.sd-board');
    expect(css).toContain('0 4px 12px');
  });
});
