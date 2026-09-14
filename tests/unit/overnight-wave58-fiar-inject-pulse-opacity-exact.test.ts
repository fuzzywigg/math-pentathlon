/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — FIAR pulse opacity keyframe body.
 * Wave57 asserts width/gradient/anim name; deepen opacity 0.5/1 body. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 58 fiar — inject pulse opacity exact', () => {
  it('fiar-pulse animates opacity 0.5 ↔ 1 on pulse-highlight', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain(
      'animation: fiar-pulse 1s ease-in-out infinite'
    );
    expect(css).toContain('@keyframes fiar-pulse');
    expect(css).toContain('opacity: 0.5');
    expect(css).toContain('opacity: 1');
  });
});
