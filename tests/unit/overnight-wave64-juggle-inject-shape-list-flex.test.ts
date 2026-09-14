/**
 * Wave 64 leftover after tip/#303 — Juggle inject shape-list flex chrome.
 * Unsaturated .juggle-shape-list leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject shape-list flex', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-list flex-wrap justify-center gap', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-list\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.juggle-shape-list\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(css).toMatch(
      /\.juggle-shape-list\s*\{[^}]*justify-content:\s*center/
    );
    expect(css).toMatch(/\.juggle-shape-list\s*\{[^}]*gap:\s*0\.5rem/);
  });
});
