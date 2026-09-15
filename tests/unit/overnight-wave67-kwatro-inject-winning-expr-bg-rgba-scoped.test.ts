/**
 * Wave 67 leftover after tip/#324 — Kwatro winning-expr bg rgba scoped.
 * Wave60 soft toContain; deepen selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject winning-expr bg rgba scoped', () => {
  it('locks scoped .kwa-winning-expr gold rgba background', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-winning-expr\s*\{[\s\S]*?background:\s*rgba\(255,215,0,0\.3\)/);
  });
});
