/**
 * Wave 54 leftover after #240 — Pinball board-ui export names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import * as ui from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 handshake — pinball export names', () => {
  it('exposes render + inject + getPlayerName helpers', () => {
    expect(typeof ui.renderChallenge).toBe('function');
    expect(typeof ui.renderResult).toBe('function');
    expect(typeof ui.renderPinballBoard).toBe('function');
    expect(typeof ui.renderScores).toBe('function');
    expect(typeof ui.renderGameOver).toBe('function');
    expect(typeof ui.injectFractionPinballStyles).toBe('function');
    expect(typeof ui.getPlayerName).toBe('function');
    expect(ui.getPlayerName('player1')).toBe('Blue');
  });
});
