/**
 * Wave 57 leftover after #263 — Kwatro board gradient + chip hover CSS. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 57 kwatro — inject board/hover', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('CSS includes e8d4b8 board gradient and selectable-chip:hover', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/#e8d4b8/);
    expect(css).toMatch(/\.kwa-selectable-chip:hover/);
  });
});
