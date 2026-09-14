/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro status align/pad.
 * Wave60 locks 1.2rem/500 + seat vars; deepen text-align + padding. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject status align/pad', () => {
  it('status is centered with 1rem padding', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-status');
    expect(css).toContain('text-align: center');
    expect(css).toContain('padding: 1rem');
  });
});
