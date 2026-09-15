/**
 * Wave 68 leftover after tip/#336 — Kwatro main-layout gap 2rem scoped.
 * Wave63 soft gap; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject main layout gap 2rem scoped', () => {
  it('main-layout uses gap 2rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-main-layout\s*\{[\s\S]*?gap:\s*2rem/);
  });
});
