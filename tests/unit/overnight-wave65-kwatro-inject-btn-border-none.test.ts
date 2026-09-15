/**
 * Wave 65 leftover after tip/#315 — Kwatro btn border none.
 * Wave63 locks pad/radius/cursor; deepen border:none leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 kwatro — inject btn border none', () => {
  it('kwa-btn clears border', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?border:\s*none/);
  });
});
