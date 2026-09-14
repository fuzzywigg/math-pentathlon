/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro board pad + radius.
 * Wave60 locks gradient/shadow; deepen padding + border-radius. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject board pad/radius', () => {
  it('board pads 1rem with 12px radius', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-board');
    expect(css).toContain('padding: 1rem');
    expect(css).toContain('border-radius: 12px');
  });
});
