/**
 * Wave 68 leftover after tip/#336 — Kwatro winning-expr bg scoped.
 * Wave60 soft bg; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject winning expr bg scoped', () => {
  it('winning-expr uses rgba gold bg', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winning-expr\s*\{[\s\S]*?background:\s*rgba\(255,215,0,0\.3\)/);
  });
});
