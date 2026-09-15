/**
 * Wave 64 leftover after tip/#306 — Kwatro inject target-info pad/radius.
 * Wave60/63 locked bg/type/strong; deepen pad + 8px radius leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — inject target pad/radius', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-target-info padding and border-radius 8px', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-target-info\s*\{[^}]*padding:\s*0\.5rem 1rem/);
    expect(css).toMatch(/\.kwa-target-info\s*\{[^}]*border-radius:\s*8px/);
  });
});
