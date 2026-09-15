/**
 * Wave 67 leftover after tip/#336 — FIAR chip-icon 16px circle border.
 * Wave57/61 size soft; lock 16px + radius 50% + #fff border leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject chip-icon 16px circle', () => {
  it('chip-icon is 16px circle with white border', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-icon\s*\{[\s\S]*?width:\s*16px[\s\S]*?height:\s*16px[\s\S]*?border-radius:\s*50%[\s\S]*?border:\s*2px solid #fff/
    );
  });
});
