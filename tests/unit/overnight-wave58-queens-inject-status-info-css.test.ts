/**
 * Wave 58 leftover after #267 — Queens status/info inject CSS.
 * Distinct from wave56 winner-banner leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

beforeEach(() => {
  document.getElementById('qg-styles')?.remove();
});

describe('Wave 58 queens — inject status/info CSS', () => {
  it('embeds .qg-status font-size and .qg-info gap', () => {
    injectQGStyles();
    const css = document.getElementById('qg-styles')?.textContent ?? '';
    expect(css).toMatch(/\.qg-status/);
    expect(css).toMatch(/font-size:\s*1\.2rem/);
    expect(css).toMatch(/\.qg-info/);
    expect(css).toMatch(/gap:\s*2rem/);
  });
});
