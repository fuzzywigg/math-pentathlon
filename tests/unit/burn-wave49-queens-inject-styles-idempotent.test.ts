/**
 * Wave 49 — Queens injectQGStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — inject styles', () => {
  beforeEach(() => {
    document.getElementById('qg-styles')?.remove();
  });
  it('injects once', () => {
    injectQGStyles();
    injectQGStyles();
    expect(document.querySelectorAll('#qg-styles').length).toBe(1);
  });
});
