/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 winner gradient + glow bodies.
 * Wave55 asserted keyframe name only; deepen gradient + glow box-shadow bodies. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject winner glow body', () => {
  it('winner banner gradient and glow keyframe bodies leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffec8b)');
    expect(css).toContain('0 0 10px rgba(255,215,0,0.5)');
    expect(css).toContain('0 0 20px rgba(255,215,0,0.8)');
  });
});
