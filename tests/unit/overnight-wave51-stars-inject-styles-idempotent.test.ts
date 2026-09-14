/**
 * Wave 51 leftover after #233 — Stars-Bars injectStyles idempotent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectStarsStyles } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — inject idempotent', () => {
  it('injects style sheet only once across repeated calls', () => {
    const before = document.querySelectorAll('style').length;
    injectStarsStyles();
    injectStarsStyles();
    expect(document.querySelectorAll('style').length).toBe(before + 1);
  });
});
