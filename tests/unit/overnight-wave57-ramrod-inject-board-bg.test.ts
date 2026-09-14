/**
 * Wave 57 leftover after #262 — Ramrod inject board bg + layout chrome.
 * Distinct from Pass/Clear chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 57 ramrod — inject board bg', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects board wood bg and layout class chrome', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toContain('.ramrod-game-area');
    expect(css).toContain('.ramrod-main-layout');
    expect(css).toMatch(/\.ramrod-board\s*\{[^}]*background:\s*#e8d4b8/);
  });
});
