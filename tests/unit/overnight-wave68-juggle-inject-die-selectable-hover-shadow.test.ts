/**
 * Wave 68 leftover after tip/#333 — die selectable hover shadow.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject die selectable hover shadow', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects selectable die hover orange shadow', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-die\.selectable:hover\s*\{[^}]*box-shadow:\s*0 4px 12px rgba\(245, 124, 0, 0\.4\)/);
  });
});
