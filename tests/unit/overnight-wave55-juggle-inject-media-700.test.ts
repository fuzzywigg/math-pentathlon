/**
 * Wave 55 leftover after #250 — Juggle inject 700px cell shrink.
 * Distinct from wave48 idempotent inject. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — inject media 700', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('embeds max-width 700px board/cell shrink rules', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(max-width: 700px\)/);
    expect(css).toMatch(/\.juggle-cell/);
    expect(css).toMatch(/width: 24px/);
    expect(css).toMatch(/flex-direction: column/);
  });
});
