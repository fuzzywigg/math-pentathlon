/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject btn transition 0.2s.
 * Wave63 valid-node locks 0.2s; deepen shared .kwa-btn transition scoped. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject btn transition 0.2s', () => {
  it('shared .kwa-btn transitions all 0.2s', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?transition:\s*all 0\.2s/);
  });
});
