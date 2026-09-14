/**
 * Wave 60 leftover after tip/#279 — Ramrod legend swatch height 12px.
 * Distinct from wave52 legend widths. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject legend height', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects .ramrod-legend-color height 12px', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(/\.ramrod-legend-color\s*\{[^}]*height:\s*12px/);
  });
});
