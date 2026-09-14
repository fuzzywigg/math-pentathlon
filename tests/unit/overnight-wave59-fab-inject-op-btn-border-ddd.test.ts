/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — Fab op-btn default border.
 * Wave58 covers selected/valid borders; deepen default #ddd border. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 59 fab — inject op-btn border ddd', () => {
  it('op-btn default border is 2px solid #ddd', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-op-btn');
    expect(css).toContain('border: 2px solid #ddd');
  });
});
