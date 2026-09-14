/**
 * Wave 55 leftover after #250 — Par 55 inject glow + mobile layout CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 55 par55 — inject CSS', () => {
  it('glow keyframes, winner banner, mobile breakpoint', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('@keyframes par55-glow');
    expect(css).toContain('.par55-winner-banner');
    expect(css).toContain('@media (max-width: 768px)');
  });
});
