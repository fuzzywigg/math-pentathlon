/**
 * Wave 60 leftover after tip/#279 — Ramrod completed seat fill RGBA.
 * Distinct from #289 valid/selected rings. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — inject completed fills', () => {
  beforeEach(() => {
    document.getElementById('ramrod-styles')?.remove();
  });

  it('injects completed.player1/player2 soft seat fills', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toContain(
      '.ramrod-box.completed.player1 {\n      background: rgba(33, 150, 243, 0.1);'
    );
    expect(css).toContain(
      '.ramrod-box.completed.player2 {\n      background: rgba(244, 67, 54, 0.1);'
    );
  });
});
