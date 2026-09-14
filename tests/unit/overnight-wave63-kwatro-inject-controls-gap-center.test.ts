/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro controls gap/center.
 * No prior .kwa-controls inject assertions. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject controls gap/center', () => {
  it('controls are centered with 1rem gap', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-controls');
    expect(css).toContain('gap: 1rem');
    expect(css).toContain('justify-content: center');
  });
});
