/**
 * Wave 60 leftover after tip/#279 — Ramrod secondary btn gray fill.
 * Distinct from #289 primary gradient. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject btn secondary', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects .ramrod-btn-secondary background #e0e0e0', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.ramrod-btn-secondary\s*\{[^}]*background:\s*#e0e0e0/
    );
  });
});
