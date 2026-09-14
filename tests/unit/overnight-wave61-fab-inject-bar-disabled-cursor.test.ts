/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab .fab-bar-disabled cursor.
 * Wave59 pins op-disabled cursor; deepen bar-disabled leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject bar-disabled cursor', () => {
  it('bar-disabled uses not-allowed cursor', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-bar-disabled');
    expect(css).toContain('cursor: not-allowed');
  });
});
