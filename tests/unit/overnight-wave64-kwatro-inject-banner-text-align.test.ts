/**
 * Wave 64 leftover after tip/#306 — Kwatro inject winner-banner text-align.
 * Wave63 locked size/anim; deepen text-align center leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject banner text-align', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-winner-banner text-align center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[^}]*text-align:\s*center/);
  });
});
