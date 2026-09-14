/**
 * Wave 49 — Kwatro styles class catalog leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — style classes', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });
  it('declares chip-info and history classes', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-chip-info/);
    expect(css).toMatch(/\.kwa-history/);
    expect(css).toMatch(/\.kwa-board/);
  });
});
