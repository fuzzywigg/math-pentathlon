/**
 * Wave 58 leftover after #267 — Pent flip button cyan inject CSS.
 * Distinct from wave56 rotate leftover and cancel leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPentEmInStyles } from '../../src/games/pent-em-in/board-ui';

beforeEach(() => {
  document.getElementById('pent-em-in-styles')?.remove();
});

describe('Wave 58 pent — inject flip CSS', () => {
  it('embeds .pent-btn-flip with #00bcd4', () => {
    injectPentEmInStyles();
    const css = document.getElementById('pent-em-in-styles')?.textContent ?? '';
    expect(css).toMatch(/\.pent-btn-flip/);
    expect(css).toMatch(/#00bcd4/);
  });
});
