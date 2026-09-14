/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 secondary btn fill/hover.
 * Wave57 asserted selector + board bg; deepen #e0e0e0 / #bdbdbd fills. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject btn-secondary fill', () => {
  it('secondary btn fill and hover leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-btn-secondary');
    expect(css).toContain('background: #e0e0e0');
    expect(css).toContain('.par55-btn-secondary:hover');
    expect(css).toContain('background: #bdbdbd');
  });
});
