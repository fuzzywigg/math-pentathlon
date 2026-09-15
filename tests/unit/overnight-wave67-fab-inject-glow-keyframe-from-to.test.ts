/**
 * Wave 67 leftover after tip/#336 — Fab glow keyframe from/to shadows.
 * Wave58 glow body soft; lock from/to rgba leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject glow keyframe from-to', () => {
  it('fab-glow keyframes use 10px/20px gold shadows', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('@keyframes fab-glow');
    expect(css).toContain(
      'from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }'
    );
    expect(css).toContain(
      'to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }'
    );
  });
});
