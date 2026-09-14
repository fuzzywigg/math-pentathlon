/**
 * Wave 56 leftover after #256 — Par 55 inject btn-primary + hand-label CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 56 par55 — btn CSS', () => {
  it('btn-primary and hand-label selectors present', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-btn-primary');
    expect(css).toContain('.par55-hand-label');
  });
});
