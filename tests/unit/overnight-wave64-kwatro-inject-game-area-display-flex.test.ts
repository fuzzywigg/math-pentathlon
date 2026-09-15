/**
 * Wave 64 leftover after tip/#306 — Kwatro inject game-area display flex.
 * Wave63 locked flex-dir/gap/pad; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject game-area display flex', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-game-area display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[^}]*display:\s*flex/);
  });
});
