/**
 * Wave 68 leftover after tip/#336 — Kwatro main-layout align flex-start scoped.
 * Wave63 soft align; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject main layout align flex start scoped', () => {
  it('main-layout uses align-items flex-start', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-main-layout\s*\{[\s\S]*?align-items:\s*flex-start/);
  });
});
