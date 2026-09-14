/**
 * Wave 57 leftover after #257 — FIAR chip-icon size + banner anim/gradient. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 57 fiar — inject chip size banner anim', () => {
  it('includes chip-icon size, drop-shadow, banner gradient + animation use', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('drop-shadow(0 4px 8px rgba(0,0,0,0.15))');
    expect(css).toContain('width: 16px');
    expect(css).toContain('border-radius: 50%');
    expect(css).toContain('linear-gradient(135deg, #ffd700 0%, #ffec8b 100%)');
    expect(css).toContain(
      'animation: winner-glow 1s ease-in-out infinite alternate'
    );
  });
});
