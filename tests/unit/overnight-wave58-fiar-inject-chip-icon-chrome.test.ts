/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — FIAR chip-icon height/border/shadow.
 * Wave57 covered width:16px + border-radius:50%; deepen remaining chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 58 fiar — inject chip icon chrome', () => {
  it('chip-icon has height 16px, white border, soft shadow', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-chip-icon');
    expect(css).toContain('height: 16px');
    expect(css).toContain('border: 2px solid #fff');
    expect(css).toContain('box-shadow: 0 1px 3px rgba(0,0,0,0.3)');
  });
});
