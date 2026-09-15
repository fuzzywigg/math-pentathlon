/**
 * Wave 67 leftover after tip/#324 — Kwatro history h4 margin scoped.
 * Wave63 soft .kwa-history h4; deepen margin leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject history h4 margin scoped', () => {
  it('locks scoped .kwa-history h4 margin 0 0 0.5rem 0', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-history h4\s*\{[\s\S]*?margin:\s*0 0 0\.5rem 0/);
  });
});
