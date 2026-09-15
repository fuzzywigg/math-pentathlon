/**
 * Wave 67 leftover after tip/#316 — FIAR chips-info gap + 0.9rem.
 * Soft chips-info; lock gap 2rem + font-size leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject chips-info gap 0.9rem', () => {
  it('chips-info is flex with gap 2rem and 0.9rem font', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chips-info\s*\{[\s\S]*?display:\s*flex[\s\S]*?gap:\s*2rem[\s\S]*?font-size:\s*0\.9rem/
    );
  });
});
