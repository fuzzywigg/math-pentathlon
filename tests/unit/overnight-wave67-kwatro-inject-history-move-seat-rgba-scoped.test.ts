/**
 * Wave 67 leftover after tip/#324 — Kwatro history-move seat rgba scoped.
 * Wave60 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject history-move seat rgba scoped', () => {
  it('locks scoped player1/player2 history-move backgrounds', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history-move\.player1\s*\{[\s\S]*?background:\s*rgba\(33,150,243,0\.1\)/);
    expect(css).toMatch(/\.kwa-history-move\.player2\s*\{[\s\S]*?background:\s*rgba\(244,67,54,0\.1\)/);
  });
});
