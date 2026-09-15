/**
 * Wave 67 leftover after tip/#324 — Kwatro primary btn color white.
 * Wave60 locks gradient; deepen color:white leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject btn primary color white', () => {
  it('primary btn text is white', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-primary\s*\{[\s\S]*?color:\s*white/);
  });
});
