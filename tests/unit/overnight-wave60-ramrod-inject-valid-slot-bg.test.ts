/**
 * Wave 60 leftover after tip/#279 — Ramrod valid slot background fill.
 * #289 locked ring box-shadow only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject valid slot bg', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects .ramrod-slot.valid background rgba green', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.ramrod-slot\.valid\s*\{[^}]*background:\s*rgba\(76, 175, 80, 0\.2\)/
    );
  });
});
