/**
 * Wave 49 — Frac-fact injectFracFactStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

describe('Wave 49 frac-fact — inject styles', () => {
  beforeEach(() => {
    document.getElementById('frac-fact-styles')?.remove();
  });
  it('injects once', () => {
    injectFracFactStyles();
    injectFracFactStyles();
    expect(document.querySelectorAll('#frac-fact-styles').length).toBe(1);
  });
});
