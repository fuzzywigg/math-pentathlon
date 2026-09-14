/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — FIAR winner-glow keyframe body.
 * Wave57/58 assert anim name + fab-glow bodies; deepen fiar from/to shadows. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 59 fiar — inject winner-glow keyframe body', () => {
  it('winner-glow keyframes alternate gold box-shadow strength', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('@keyframes winner-glow');
    expect(css).toContain(
      'from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }'
    );
    expect(css).toContain(
      'to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }'
    );
  });
});
