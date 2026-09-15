/**
 * Wave 66 leftover after tip/#316 — FIAR chip-icon radius+border scoped.
 * Wave61 soft height/shadow; lock 50% radius + white border leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject chip-icon radius border scoped', () => {
  it('chip-icon is circular with white border', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-icon\s*\{[\s\S]*?border-radius:\s*50%[\s\S]*?border:\s*2px solid #fff/
    );
  });
});
