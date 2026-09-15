/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro inject btn-primary color white.
 * Wave60 locks gradient + hover lift; deepen color: white. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 kwatro — inject btn-primary color white', () => {
  it('primary text is white', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-primary\s*\{[\s\S]*?color:\s*white/);
  });
});
