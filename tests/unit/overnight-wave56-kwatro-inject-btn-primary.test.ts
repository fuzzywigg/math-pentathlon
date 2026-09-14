/**
 * Wave 56 leftover after #256 — Kwatro inject btn primary/secondary CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 56 kwatro — btn CSS', () => {
  it('primary and secondary button classes present', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toContain('.kwa-btn-primary');
    expect(css).toContain('.kwa-btn-secondary');
  });
});
