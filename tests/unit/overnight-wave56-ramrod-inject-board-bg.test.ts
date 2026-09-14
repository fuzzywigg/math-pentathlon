/**
 * Wave 56 leftover after #256 — Ramrod inject board background #e8d4b8.
 * Distinct from wave55 768px media leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 56 ramrod — inject board bg', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('embeds .ramrod-board wood bg and completed seat borders', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(/\.ramrod-board/);
    expect(css).toMatch(/#e8d4b8/);
    expect(css).toMatch(/\.ramrod-box\.completed\.player1/);
    expect(css).toMatch(/\.ramrod-box\.completed\.player2/);
    expect(css).toMatch(/\.ramrod-slot\.valid/);
    expect(css).toMatch(/#4caf50/);
  });
});
