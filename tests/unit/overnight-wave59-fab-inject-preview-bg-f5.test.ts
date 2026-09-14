/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab operation-preview background.
 * Wave55 covers preview layout; deepen #f5f5f5 fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject preview bg f5', () => {
  it('operation-preview uses #f5f5f5 background', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-operation-preview');
    expect(css).toContain('background: #f5f5f5');
  });
});
