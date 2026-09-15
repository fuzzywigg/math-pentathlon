/**
 * Wave 64 leftover after #305 — Fab operation-buttons gap chrome.
 * Wave58 pins justify-content center; deepen 0.75rem gap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 64 fab — inject op-buttons gap', () => {
  it('operation-buttons use 0.75rem gap', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-operation-buttons');
    expect(css).toContain('gap: 0.75rem');
  });
});
