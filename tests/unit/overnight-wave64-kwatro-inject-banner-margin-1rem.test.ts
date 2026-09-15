/**
 * Wave 64 leftover after tip/#306 — Kwatro inject winner-banner margin 1rem.
 * Wave63 locked size/anim; deepen margin leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject banner margin 1rem', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-winner-banner margin 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[^}]*margin:\s*1rem/);
  });
});
