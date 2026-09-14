/**
 * Wave 57 leftover after #263 — Par 55 secondary btn + board bg CSS. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 57 par55 — inject secondary/board', () => {
  beforeEach(() => {
    document.getElementById('par55-styles')?.remove();
  });

  it('CSS includes .par55-btn-secondary and board #d4edda', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toMatch(/\.par55-btn-secondary/);
    expect(css).toMatch(/\.par55-board/);
    expect(css).toMatch(/#d4edda/);
  });
});
