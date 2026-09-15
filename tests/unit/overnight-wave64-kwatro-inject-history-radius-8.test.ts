/**
 * Wave 64 leftover after tip/#306 — Kwatro inject history border-radius 8px.
 * Wave63 locked max-width/bg/pad; deepen radius leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject history radius 8', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-history border-radius 8px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-history\s*\{[^}]*border-radius:\s*8px/);
  });
});
