/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Pinball glow stop-opacity.
 * Wave57 locked stop-color #ffeb3b; deepen opacity leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 58 pinball board — glow stop opacity', () => {
  it('target-glow stop-opacity 0.8 and 0 leftovers', () => {
    const svg = renderPinballBoard(createInitialState());
    const glow = svg.querySelector('#target-glow');
    expect(glow?.innerHTML).toContain('stop-opacity="0.8"');
    expect(glow?.innerHTML).toContain('stop-opacity="0"');
  });
});
