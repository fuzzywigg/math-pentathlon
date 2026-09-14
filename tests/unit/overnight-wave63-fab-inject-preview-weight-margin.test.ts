/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab operation-preview weight/margin.
 * Wave56/59 pin preview bg/font; deepen weight 600 + margin-bottom leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject preview weight margin', () => {
  it('operation preview is weight 600 with 1rem bottom margin', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-operation-preview');
    expect(css).toContain('font-weight: 600');
    expect(css).toContain('margin-bottom: 1rem');
  });
});
