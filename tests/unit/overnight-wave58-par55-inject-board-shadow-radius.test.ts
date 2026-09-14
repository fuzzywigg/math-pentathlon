/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 board radius + shadow.
 * Wave57 asserted #d4edda; deepen radius/shadow leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject board shadow radius', () => {
  it('board border-radius and box-shadow leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-board');
    expect(css).toContain('border-radius: 12px');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0,0,0,0.2)');
  });
});
