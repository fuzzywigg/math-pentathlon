/**
 * Wave 68 leftover after tip/#336 — Kwatro chip-info bg 333 scoped.
 * Wave60 soft bg; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject chip info bg 333 scoped', () => {
  it('chip-info uses background #333', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-chip-info\s*\{[\s\S]*?background:\s*#333/);
  });
});
