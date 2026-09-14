/**
 * Wave 56 leftover after #255/#256 — Fab max-width 1200 + mobile 1fr. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — inject max-width mobile 1fr', () => {
  it('includes game-area max-width 1200px and mobile single-column 1fr', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('max-width: 1200px');
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('grid-template-columns: 1fr;');
    expect(css).toContain('.fab-answer-player1');
    expect(css).toContain('#bbdefb');
    expect(css).toContain('.fab-answer-player2');
    expect(css).toContain('#ffcdd2');
    expect(css).toContain('max-height: 200px');
  });
});
