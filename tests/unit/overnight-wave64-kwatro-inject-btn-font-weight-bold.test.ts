/**
 * Wave 64 leftover after tip/#306 — Kwatro inject btn font-weight bold.
 * Wave63 locked pad/radius; deepen font-weight leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject btn font-weight bold', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-btn font-weight bold', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-btn\s*\{[^}]*font-weight:\s*bold/);
  });
});
