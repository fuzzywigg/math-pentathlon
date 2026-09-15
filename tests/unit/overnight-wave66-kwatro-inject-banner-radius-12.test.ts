/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject banner radius 12.
 * Wave63 board pad locks 12px; deepen banner border-radius scoped. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject banner radius 12', () => {
  it('winner-banner uses 12px radius', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?border-radius:\s*12px/);
  });
});
