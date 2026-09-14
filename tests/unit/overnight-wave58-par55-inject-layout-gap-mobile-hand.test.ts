/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 layout gap + mobile hand row.
 * Wave55 asserted mobile breakpoint presence; deepen gap + hand flex leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject layout gap mobile hand', () => {
  it('main-layout gap 2rem and mobile hand row leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-main-layout');
    expect(css).toContain('gap: 2rem');
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('flex-direction: row');
  });
});
