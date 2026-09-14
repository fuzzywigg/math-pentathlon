/**
 * Wave 49 — Par55 styles hand/score classes leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — style classes', () => {
  beforeEach(() => {
    document.getElementById('par55-styles')?.remove();
  });
  it('declares hand and scores classes', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')!.textContent || '';
    expect(css).toMatch(/\.par55-hand/);
    expect(css).toMatch(/\.par55-scores/);
    expect(css).toMatch(/\.par55-history/);
  });
});
