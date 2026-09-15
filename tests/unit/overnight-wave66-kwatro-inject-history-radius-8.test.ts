/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject history radius 8.
 * Wave63 locks max-width/muted bg/pad; deepen border-radius 8px scoped. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject history radius 8', () => {
  it('history panel uses 8px radius', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
