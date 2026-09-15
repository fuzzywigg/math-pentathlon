/**
 * Wave 68 leftover after tip/#336 — Kwatro target-info bg scoped.
 * Wave60 soft bg; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject target info bg scoped', () => {
  it('target-info uses background #f5f5f5', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-target-info\s*\{[\s\S]*?background:\s*#f5f5f5/);
  });
});
