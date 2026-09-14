/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro svg display block.
 * Wave55 locks viewBox; deepen .kwa-svg display. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject svg display', () => {
  it('kwa-svg is display block', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-svg');
    expect(css).toContain('display: block');
  });
});
