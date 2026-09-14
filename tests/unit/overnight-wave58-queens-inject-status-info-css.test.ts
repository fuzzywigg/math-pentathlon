/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Queens inject status/info CSS selectors.
 * Distinct from wave56 winner-banner CSS leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — inject status/info CSS', () => {
  beforeEach(() => {
    document.getElementById('qg-styles')?.remove();
  });

  it('embeds .qg-status.player1/player2 and .qg-info', () => {
    injectQGStyles();
    const css = document.getElementById('qg-styles')?.textContent ?? '';
    expect(css).toMatch(/\.qg-status\.player1/);
    expect(css).toMatch(/\.qg-status\.player2/);
    expect(css).toMatch(/\.qg-info/);
  });
});
