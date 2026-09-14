/**
 * Wave 49 — FIAR injectFiarStyles idempotent leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => document.getElementById('fiar-styles')?.remove());

describe('Wave 49 fiar — inject styles', () => {
  it('second inject keeps a single #fiar-styles node', () => {
    injectFiarStyles();
    injectFiarStyles();
    expect(document.querySelectorAll('#fiar-styles')).toHaveLength(1);
  });
});
