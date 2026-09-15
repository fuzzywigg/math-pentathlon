/**
 * Wave 65 leftover after tip/#315 — Kwatro main-layout display flex.
 * Wave63 locks gap/flex-start; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 kwatro — inject main-layout display flex', () => {
  it('main-layout uses display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-main-layout\s*\{[\s\S]*?display:\s*flex/);
  });
});
