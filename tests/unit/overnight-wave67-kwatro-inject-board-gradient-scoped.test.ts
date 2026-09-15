/**
 * Wave 67 leftover after tip/#324 — Kwatro board gradient scoped.
 * Wave60 soft-contains stops; deepen .kwa-board scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject board gradient scoped', () => {
  it('board locks linear-gradient inside .kwa-board', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(
      /\.kwa-board\s*\{[\s\S]*?linear-gradient\(135deg, #e8d4b8, #d4c4a8\)/
    );
  });
});
