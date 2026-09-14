/**
 * Wave 58 leftover after #267 — Pent cancel/instructions/status inject CSS.
 * Distinct from wave56 winner/AI leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPentEmInStyles } from '../../src/games/pent-em-in/board-ui';

beforeEach(() => {
  document.getElementById('pent-em-in-styles')?.remove();
});

describe('Wave 58 pent — inject cancel/instructions/status CSS', () => {
  it('embeds cancel grey, instructions max-width, player1 status bg', () => {
    injectPentEmInStyles();
    const css = document.getElementById('pent-em-in-styles')?.textContent ?? '';
    expect(css).toMatch(/\.pent-btn-cancel/);
    expect(css).toMatch(/#9e9e9e/);
    expect(css).toMatch(/\.pent-instructions/);
    expect(css).toMatch(/max-width:\s*400px/);
    expect(css).toMatch(/\.pent-status\.player1/);
    expect(css).toMatch(/#e3f2fd/);
  });
});
