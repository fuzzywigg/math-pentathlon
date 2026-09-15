/**
 * Wave 66 leftover after tip/#316 — Juggle inject media boards column.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject media boards column', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('700px media stacks boards column and centers', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(max-width: 700px\)/);
    expect(css).toMatch(
      /@media \(max-width: 700px\)[\s\S]*?\.juggle-boards\s*\{[^}]*flex-direction:\s*column/
    );
    expect(css).toMatch(
      /@media \(max-width: 700px\)[\s\S]*?\.juggle-boards\s*\{[^}]*align-items:\s*center/
    );
  });
});
