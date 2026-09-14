/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — FIAR chips-info gap + font.
 * Distinct from wave57 chip width. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 58 fiar — inject chips info gap font', () => {
  it('chips-info is flex with 2rem gap and 0.9rem type', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-chips-info');
    expect(css).toContain('display: flex');
    expect(css).toContain('gap: 2rem');
    expect(css).toContain('font-size: 0.9rem');
  });
});
