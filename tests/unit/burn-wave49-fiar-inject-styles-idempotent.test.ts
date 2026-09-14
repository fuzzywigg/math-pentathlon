/**
 * Wave 49 leftover after #221/#226/#227 — FIAR injectFiarStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — inject styles', () => {
  beforeEach(() => document.getElementById('fiar-styles')?.remove());
  it('injects once under #fiar-styles', () => {
    injectFiarStyles();
    injectFiarStyles();
    expect(document.querySelectorAll('#fiar-styles')).toHaveLength(1);
  });
});
