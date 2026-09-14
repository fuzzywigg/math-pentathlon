/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro winning-expr color/radius.
 * Wave60 locks 1.3rem/bold/gold tint; deepen #333 color + radius. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 63 kwatro — inject winning-expr color/radius', () => {
  it('winning-expr is #333 with 8px radius', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-winning-expr');
    expect(css).toContain('color: #333');
    expect(css).toContain('border-radius: 8px');
  });
});
