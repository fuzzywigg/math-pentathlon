/**
 * Wave 64 leftover after tip/#306 — Kwatro inject btn-primary color white.
 * Wave60 locked gradient fill; deepen color:white leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject btn-primary color white', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-btn-primary color white', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-btn-primary\s*\{[^}]*color:\s*white/);
  });
});
