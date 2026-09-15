/**
 * Wave 67 leftover after tip/#316 — FIAR winner-glow from/to shadows.
 * Wave57 anim soft; lock winner-glow from/to leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject winner-glow from-to', () => {
  it('winner-glow keyframes use 10px/20px gold shadows', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('@keyframes winner-glow');
    expect(css).toContain(
      'from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }'
    );
    expect(css).toContain(
      'to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }'
    );
  });
});
