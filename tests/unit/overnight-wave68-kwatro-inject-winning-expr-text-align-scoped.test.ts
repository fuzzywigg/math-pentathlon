/**
 * Wave 68 leftover after tip/#336 — Kwatro winning-expr text-align scoped.
 * Wave60 soft align; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject winning expr text align scoped', () => {
  it('winning-expr uses text-align center', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winning-expr\s*\{[^}]*text-align:\s*center/);
  });
});
