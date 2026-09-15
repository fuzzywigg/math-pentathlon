/**
 * Wave 67 leftover after tip/#323/#324 — die flex center chrome.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject die flex center', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects die display flex + center align/justify', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*align-items:\s*center/);
    expect(css).toMatch(/\.juggle-die\s*\{[^}]*justify-content:\s*center/);
  });
});
