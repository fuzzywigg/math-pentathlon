/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject btn font-weight bold.
 * Wave63 locks pad/radius; deepen font-weight: bold on shared btn. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject btn font-weight bold', () => {
  it('shared .kwa-btn is font-weight bold', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?font-weight:\s*bold/);
  });
});
