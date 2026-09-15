/**
 * Wave 64 leftover after tip/#306 — Kwatro inject winning-expr padding.
 * Wave63 locked color/radius; deepen padding 0.5rem 1rem leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject winning-expr pad half', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-winning-expr padding 0.5rem 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-winning-expr\s*\{[^}]*padding:\s*0\.5rem 1rem/);
  });
});
