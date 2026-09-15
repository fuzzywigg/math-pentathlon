/**
 * Wave 67 leftover after tip/#316 — Fab pulse 50% 8px fade.
 * Wave58 pulse body; lock 50% 8px transparent leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject pulse 50% 8px', () => {
  it('fab-pulse 50% expands to 8px transparent green', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain(
      '50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }'
    );
  });
});
