/**
 * Wave 59 Contig/SD residual — Sum injectSDStyles idempotent. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — inject idempotent', () => {
  it('second inject leaves a single style tag', () => {
    injectSDStyles();
    injectSDStyles();
    expect(document.querySelectorAll('#sd-styles').length).toBe(1);
  });
});
