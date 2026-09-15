/**
 * Wave 68 leftover after tip/#336 — Kwatro target-info text-align scoped.
 * Soft text-align; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject target info text align scoped', () => {
  it('target-info uses text-align center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-target-info\s*\{[^}]*text-align:\s*center/);
  });
});
