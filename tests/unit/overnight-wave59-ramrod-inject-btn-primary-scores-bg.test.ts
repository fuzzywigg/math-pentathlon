/**
 * Wave 59 leftover after #279 — Ramrod primary btn gradient + scores #333 bg.
 * Distinct from wave58 board bg and rod colors. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 59 ramrod — inject btn primary scores bg', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects primary btn gradient and scores dark bg', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toContain('.ramrod-btn-primary');
    expect(css).toContain('linear-gradient(135deg, #2196f3, #1976d2)');
    expect(css).toMatch(/\.ramrod-scores\s*\{[^}]*background:\s*#333/);
  });
});
