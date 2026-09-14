/**
 * Wave 57 leftover after #257 — Fab inject selected/opacity/animation CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 57 fab — inject selected opacity anim css', () => {
  it('includes selected fill, disabled opacity, animation usage, secondary hover', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('#fff3e0');
    expect(css).toContain('opacity: 0.4');
    expect(css).toContain('cursor: not-allowed');
    expect(css).toContain('animation: fab-pulse 1s ease-in-out infinite');
    expect(css).toContain(
      'animation: fab-glow 1s ease-in-out infinite alternate'
    );
    expect(css).toContain('.fab-btn-secondary:hover');
  });
});
