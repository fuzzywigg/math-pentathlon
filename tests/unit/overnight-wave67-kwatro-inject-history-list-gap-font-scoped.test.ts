/**
 * Wave 67 leftover after tip/#324 — Kwatro history-list gap/font scoped.
 * Wave63 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject history-list gap font scoped', () => {
  it('locks scoped .kwa-history-list gap 0.25rem and font-size 0.8rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history-list\s*\{[\s\S]*?gap:\s*0\.25rem/);
    expect(css).toMatch(/\.kwa-history-list\s*\{[\s\S]*?font-size:\s*0\.8rem/);
  });
});
