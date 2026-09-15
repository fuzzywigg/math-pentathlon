/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject btn border none.
 * Wave63 locks pad/radius/cursor; deepen border: none. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject btn border none', () => {
  it('shared .kwa-btn clears border', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?border:\s*none/);
  });
});
