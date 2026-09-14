/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR chip-count flex.
 * Wave58 pins chips-info gap; deepen chip-count flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 61 fiar — inject chip-count flex', () => {
  it('chip-count is flex with center align and 0.5rem gap', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-chip-count');
    expect(css).toContain('display: flex');
    expect(css).toContain('align-items: center');
    expect(css).toContain('gap: 0.5rem');
  });
});
