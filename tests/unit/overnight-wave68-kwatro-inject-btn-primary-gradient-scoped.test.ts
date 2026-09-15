/**
 * Wave 68 leftover after tip/#336 — Kwatro btn-primary gradient scoped.
 * Wave60 soft gradient; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject btn primary gradient scoped', () => {
  it('btn-primary uses blue gradient', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-primary\s*\{[\s\S]*?linear-gradient\(135deg, #2196f3, #1976d2\)/);
  });
});
