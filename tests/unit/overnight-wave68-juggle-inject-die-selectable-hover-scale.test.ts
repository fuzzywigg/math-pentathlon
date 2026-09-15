/**
 * Wave 68 leftover after tip/#333 — die selectable hover scale.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject die selectable hover scale', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects selectable die hover scale 1.1', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die\.selectable:hover\s*\{[^}]*transform:\s*scale\(1\.1\)/);
  });
});
