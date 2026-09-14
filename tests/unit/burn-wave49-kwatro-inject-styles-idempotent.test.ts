/**
 * Wave 49 — Kwatro injectKwaStyles idempotent leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — inject styles', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });
  it('injects once', () => {
    injectKwaStyles();
    injectKwaStyles();
    expect(document.querySelectorAll('#kwa-styles').length).toBe(1);
  });
});
