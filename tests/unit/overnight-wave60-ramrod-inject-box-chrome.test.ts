/**
 * Wave 60 leftover after tip/#279 — Ramrod box chrome tokens.
 * Distinct from wave58 board wood bg / #289 rings. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject box chrome', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects .ramrod-box size and parchment chrome', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(/\.ramrod-box\s*\{[^}]*width:\s*120px/);
    expect(css).toMatch(/\.ramrod-box\s*\{[^}]*min-height:\s*80px/);
    expect(css).toMatch(/\.ramrod-box\s*\{[^}]*background:\s*#f5f0e8/);
    expect(css).toMatch(/\.ramrod-box\s*\{[^}]*border:\s*2px solid #c9b89b/);
  });
});
