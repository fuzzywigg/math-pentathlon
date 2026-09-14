/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — FIAR seat vars + banner radius.
 * Wave57 covered banner gradient/anim; deepen radius + chip seat vars. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 58 fiar — inject seat vars banner radius', () => {
  it('chip seats use player color vars and banner is 8px radius', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-chip-icon.player1');
    expect(css).toContain('background: var(--color-player1, #2196f3)');
    expect(css).toContain('.fiar-chip-icon.player2');
    expect(css).toContain('background: var(--color-player2, #f44336)');
    expect(css).toContain('.fiar-winner-banner');
    expect(css).toContain('border-radius: 8px');
  });
});
