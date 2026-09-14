/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro secondary btn fills.
 * Wave56 class-only; deepen #e0e0e0 / hover #bdbdbd. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject btn-secondary fills', () => {
  it('secondary is #e0e0e0 with #bdbdbd hover', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-btn-secondary');
    expect(css).toContain('background: #e0e0e0');
    expect(css).toContain('.kwa-btn-secondary:hover');
    expect(css).toContain('background: #bdbdbd');
  });
});
