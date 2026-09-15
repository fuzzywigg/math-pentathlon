/**
 * Wave 67 leftover after tip/#324 — Kwatro winner-banner anim scoped.
 * Wave63 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject banner anim scoped', () => {
  it('locks scoped .kwa-winner-banner kwa-glow animation', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?animation:\s*kwa-glow 1s ease-in-out infinite alternate/);
  });
});
