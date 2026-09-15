/**
 * Wave 64 leftover after tip/#306 — Kwatro inject chip-info display flex.
 * Wave63 locked gap/pad; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject chip-info display flex', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-chip-info display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-chip-info\s*\{[^}]*display:\s*flex/);
  });
});
