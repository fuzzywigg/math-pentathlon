/**
 * Wave 59 Contig/SD residual — Contig injectContigStyles idempotent. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 59 contig — inject idempotent', () => {
  it('second inject leaves a single style tag', () => {
    injectContigStyles();
    injectContigStyles();
    expect(document.querySelectorAll('#contig-styles').length).toBe(1);
  });
});
