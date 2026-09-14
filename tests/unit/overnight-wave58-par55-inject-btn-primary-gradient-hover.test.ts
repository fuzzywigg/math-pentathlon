/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 primary btn gradient/hover.
 * Wave56 asserted selector presence; deepen fill + hover lift leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject btn-primary gradient', () => {
  it('primary btn gradient and hover lift leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('linear-gradient(135deg, #2196f3, #1976d2)');
    expect(css).toContain('.par55-btn-primary:hover');
    expect(css).toContain('translateY(-2px)');
    expect(css).toContain('rgba(33,150,243,0.3)');
  });
});
