/**
 * Wave 64 leftover after tip/#306 — Kwatro inject btn border none.
 * Wave63 locked pad/radius/cursor; deepen border:none leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject btn border none', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-btn border none', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-btn\s*\{[^}]*border:\s*none/);
  });
});
