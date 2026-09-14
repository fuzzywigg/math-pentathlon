/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — FIAR banner bold + margin.
 * Wave58 covers radius; deepen font-weight bold and margin: 1rem. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 59 fiar — inject banner bold margin', () => {
  it('winner banner is bold with 1rem margin', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-winner-banner');
    expect(css).toContain('font-weight: bold');
    expect(css).toContain('margin: 1rem');
  });
});
