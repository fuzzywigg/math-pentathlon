/**
 * Wave 65 leftover after tip/#305 — FIAR winner banner 0%/100% stops exact.
 * Soft gradient existed; lock stop-percent shorthand contrast vs fab. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 65 fiar — inject winner banner stops exact', () => {
  it('winner-banner gradient keeps 0% and 100% stops', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-winner-banner\s*\{[\s\S]*?background:\s*linear-gradient\(135deg,\s*#ffd700 0%,\s*#ffec8b 100%\)/
    );
  });
});
