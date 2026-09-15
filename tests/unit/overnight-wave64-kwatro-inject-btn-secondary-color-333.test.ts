/**
 * Wave 64 leftover after tip/#306 — Kwatro inject btn-secondary color #333.
 * Wave60 locked fills; deepen color:#333 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject btn-secondary color #333', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-btn-secondary color #333', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-btn-secondary\s*\{[^}]*color:\s*#333/);
  });
});
