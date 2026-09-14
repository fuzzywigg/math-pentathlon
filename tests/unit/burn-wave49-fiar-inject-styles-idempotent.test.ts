/**
 * Wave 49 — FIAR injectFiarStyles idempotent leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — inject styles', () => {
  beforeEach(() => {
    document.getElementById('fiar-styles')?.remove();
  });
  it('injects once', () => {
    injectFiarStyles();
    injectFiarStyles();
    expect(document.querySelectorAll('#fiar-styles').length).toBe(1);
  });
});
