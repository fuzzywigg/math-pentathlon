/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro winning-expr inject chrome.
 * No prior exact font-size / gold tint assertions. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject winning-expr chrome', () => {
  it('winning-expr is 1.3rem bold on gold tint', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-winning-expr');
    expect(css).toContain('font-size: 1.3rem');
    expect(css).toContain('font-weight: bold');
    expect(css).toContain('background: rgba(255,215,0,0.3)');
  });
});
