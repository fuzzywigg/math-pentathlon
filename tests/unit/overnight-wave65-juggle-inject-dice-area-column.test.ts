/**
 * Wave 65 leftover after tip/#315 — Juggle inject dice-area column chrome.
 * Unsaturated .juggle-dice-area leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject dice-area column', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-dice-area flex column align gap', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(
      /\.juggle-dice-area\s*\{[^}]*flex-direction:\s*column/
    );
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.juggle-dice-area\s*\{[^}]*gap:\s*0\.5rem/);
  });
});
