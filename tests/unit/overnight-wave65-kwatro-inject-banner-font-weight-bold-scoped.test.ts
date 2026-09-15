/**
 * Wave 65 leftover after tip/#315 — Kwatro winner banner font-weight bold.
 * Size/anim covered; deepen font-weight leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 kwatro — inject banner font-weight bold scoped', () => {
  it('winner banner uses font-weight bold', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(
      /\.kwa-winner-banner\s*\{[\s\S]*?font-weight:\s*bold/
    );
  });
});
