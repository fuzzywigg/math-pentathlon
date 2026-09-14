/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab op-selected fill.
 * Wave58 pins op-valid green; deepen selected orange leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject op-selected fill', () => {
  it('op-selected uses #fff3e0 fill', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-op-selected');
    expect(css).toContain('background: #fff3e0');
  });
});
