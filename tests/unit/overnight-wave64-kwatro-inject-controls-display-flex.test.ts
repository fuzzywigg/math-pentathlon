/**
 * Wave 64 leftover after tip/#306 — Kwatro inject controls display flex.
 * Wave63 locked gap/justify; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject controls display flex', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-controls display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-controls\s*\{[^}]*display:\s*flex/);
  });
});
