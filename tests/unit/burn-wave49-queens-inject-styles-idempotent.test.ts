/**
 * Wave 49 leftover after #221/#226/#227 — Queens injectQGStyles idempotent. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — inject styles', () => {
  beforeEach(() => document.getElementById('qg-styles')?.remove());
  it('injects once under #qg-styles', () => {
    injectQGStyles();
    injectQGStyles();
    expect(document.querySelectorAll('#qg-styles')).toHaveLength(1);
  });
});
