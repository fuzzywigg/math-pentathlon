/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro main-layout gap chrome.
 * No prior .kwa-main-layout assertions. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject main-layout gap', () => {
  it('main-layout uses 2rem gap and flex-start alignment', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-main-layout');
    expect(css).toContain('gap: 2rem');
    expect(css).toContain('align-items: flex-start');
  });
});
