/**
 * Wave 65 leftover after tip/#315 — Juggle inject shape-name chrome.
 * Unsaturated .shape-name leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape-name chrome', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .shape-name 0.75rem #666', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.shape-name\s*\{[^}]*font-size:\s*0\.75rem/);
    expect(css).toMatch(/\.shape-name\s*\{[^}]*color:\s*#666/);
  });
});
