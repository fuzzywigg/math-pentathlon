/**
 * Wave 67 leftover after tip/#324 — Kwatro player-info seat color vars scoped.
 * Wave60 soft seat vars; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject player-info seat vars scoped', () => {
  it('locks scoped player1/player2 info color vars', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-player-info\.player1\s*\{[\s\S]*?color:\s*var\(--color-player1,\s*#2196f3\)/);
    expect(css).toMatch(/\.kwa-player-info\.player2\s*\{[\s\S]*?color:\s*var\(--color-player2,\s*#f44336\)/);
  });
});
