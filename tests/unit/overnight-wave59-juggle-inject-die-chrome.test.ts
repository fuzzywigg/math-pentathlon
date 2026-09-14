/**
 * Wave 59 leftover after #279 — Juggle inject die size/fill/font chrome.
 * Distinct from wave58 cell 28px and roll gradient. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 59 juggle — inject die chrome', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die 60px / #fff8e1 / 40px font', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*width:\s*60px/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*height:\s*60px/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*background:\s*#fff8e1/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*font-size:\s*40px/);
  });
});
