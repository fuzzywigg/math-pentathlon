/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab history-list flex gap.
 * Wave56/57 pin max-height/overflow; deepen flex column gap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject history-list flex gap', () => {
  it('history-list is column flex with 0.25rem gap', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-history-list');
    expect(css).toContain('display: flex');
    expect(css).toContain('flex-direction: column');
    expect(css).toContain('gap: 0.25rem');
  });
});
