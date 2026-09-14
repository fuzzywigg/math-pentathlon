/**
 * Wave 57 leftover after #267 — Pent inject cancel/instructions/status CSS.
 * Distinct from wave56 winner/AI CSS leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPentEmInStyles } from '../../src/games/pent-em-in/board-ui';

describe('Wave 57 pent — inject cancel/status CSS', () => {
  beforeEach(() => {
    document.getElementById('pent-em-in-styles')?.remove();
  });

  it('embeds cancel, instructions, status.player1, and AI seat player1', () => {
    injectPentEmInStyles();
    const css = document.getElementById('pent-em-in-styles')?.textContent ?? '';
    expect(css).toMatch(/\.pent-btn-cancel/);
    expect(css).toMatch(/\.pent-instructions/);
    expect(css).toMatch(/\.pent-status\.player1/);
    expect(css).toMatch(
      /\[data-ai-seat="player1"\] \.pent-status\.player1/
    );
  });
});
