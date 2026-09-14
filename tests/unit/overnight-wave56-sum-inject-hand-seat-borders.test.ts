/**
 * Wave 56 leftover after #243 — Sum Dominoes inject hand seat borders residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject hand seat borders', () => {
  it('borders player1/2 hands with seat CSS vars', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')!.textContent!;
    expect(css).toContain('.sd-hand-player1');
    expect(css).toContain('.sd-hand-player2');
    expect(css).toContain('--color-player1, #2196f3');
    expect(css).toContain('--color-player2, #f44336');
  });
});
