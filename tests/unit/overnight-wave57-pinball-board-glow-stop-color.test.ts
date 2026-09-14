/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball target-glow stop-color.
 * Wave52/54 asserted glow id/url only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 57 pinball board — glow stop color', () => {
  it('target-glow radial stops use #ffeb3b leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const glow = svg.querySelector('#target-glow');
    expect(glow).toBeTruthy();
    expect(glow?.innerHTML).toContain('stop-color="#ffeb3b"');
  });
});
