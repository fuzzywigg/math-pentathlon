/**
 * Wave 54 leftover after #237 — FIAR CSS chips-info / winner-glow leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => document.getElementById('fiar-styles')?.remove());

describe('Wave 54 fiar — inject chips glow', () => {
  it('CSS blob includes chips-info, chip icons, status seats, glow, drop-shadow', () => {
    injectFiarStyles();
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(document.querySelectorAll('#fiar-styles')).toHaveLength(1);
    expect(css).toContain('.fiar-chips-info');
    expect(css).toContain('.fiar-chip-icon.player1');
    expect(css).toContain('.fiar-chip-icon.player2');
    expect(css).toContain('.fiar-status.player1');
    expect(css).toContain('.fiar-status.player2');
    expect(css).toContain('@keyframes winner-glow');
    expect(css).toContain('drop-shadow');
  });
});
