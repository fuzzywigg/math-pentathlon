/**
 * Wave 49 leftover after #221/#226/#227 — Kwatro injectKwaStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — inject styles', () => {
  beforeEach(() => document.getElementById('kwa-styles')?.remove());
  it('injects once under #kwa-styles', () => {
    injectKwaStyles();
    injectKwaStyles();
    expect(document.querySelectorAll('#kwa-styles')).toHaveLength(1);
  });
});
