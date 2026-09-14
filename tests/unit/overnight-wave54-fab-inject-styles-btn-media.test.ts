/**
 * Wave 54 leftover after #240 — Fab CSS btn / media / glow leftovers (wave53 pulse). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 54 fab — inject btn media glow', () => {
  it('CSS blob includes controls, status seats, glow, and mobile media', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-btn-primary');
    expect(css).toContain('.fab-btn-secondary');
    expect(css).toContain('.fab-controls');
    expect(css).toContain('.fab-status.player1');
    expect(css).toContain('.fab-status.player2');
    expect(css).toContain('@keyframes fab-glow');
    expect(css).toContain('@media (max-width: 768px)');
  });
});
