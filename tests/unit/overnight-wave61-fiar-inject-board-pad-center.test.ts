/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR board pad/center.
 * Wave59 pins svg filter; deepen container justify/pad leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — inject board pad center', () => {
  it('board-container is centered with 1rem padding', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-board-container');
    expect(css).toContain('justify-content: center');
    expect(css).toContain('padding: 1rem');
  });
});
