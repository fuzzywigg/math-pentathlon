/**
 * Wave 59 leftover after #276 — Par 55 valid-base hover fill CSS. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 59 par55 — inject valid hover fill', () => {
  beforeEach(() => {
    document.getElementById('par55-styles')?.remove();
  });

  it('CSS includes .par55-valid-base:hover fill #c8e6c9', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toMatch(/\.par55-valid-base:hover/);
    expect(css).toContain('#c8e6c9');
  });
});
