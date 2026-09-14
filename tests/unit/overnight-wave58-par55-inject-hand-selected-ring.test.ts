/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 selected hand ring CSS.
 * Wave55–57 covered glow/btn/board selectors; deepen .selected ring tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject hand selected ring', () => {
  it('selected hand block uses orange ring + tint leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-hand-block.selected');
    expect(css).toContain('box-shadow: 0 0 0 2px #ff9800');
    expect(css).toContain('rgba(255,152,0,0.2)');
  });
});
