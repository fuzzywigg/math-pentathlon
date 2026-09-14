/**
 * Wave 49 — Queens injectQGStyles idempotent leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

afterEach(() => document.getElementById('qg-styles')?.remove());

describe('Wave 49 queens — inject styles', () => {
  it('second inject keeps a single #qg-styles node', () => {
    injectQGStyles();
    injectQGStyles();
    expect(document.querySelectorAll('#qg-styles')).toHaveLength(1);
  });
});
