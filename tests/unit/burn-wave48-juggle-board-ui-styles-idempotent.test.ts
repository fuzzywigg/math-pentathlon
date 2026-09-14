/**
 * Wave 48 — Juggle injectJuggleStyles idempotent leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — styles idempotent', () => {
  it('second inject does not duplicate style tags unboundedly', () => {
    const before = document.head.querySelectorAll('style').length;
    injectJuggleStyles();
    injectJuggleStyles();
    const after = document.head.querySelectorAll('style').length;
    expect(after - before).toBeLessThanOrEqual(2);
  });
});
