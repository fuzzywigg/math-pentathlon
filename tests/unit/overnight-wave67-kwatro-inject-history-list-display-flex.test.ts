/**
 * Wave 67 leftover after tip/#324 — Kwatro history-list display flex.
 * Wave63 locks column/gap/fontsize; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject history-list display flex', () => {
  it('history-list uses display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history-list\s*\{[\s\S]*?display:\s*flex/);
  });
});
