/**
 * Overnight HEAVY leftover after #241 — Remainder board-ui export names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import * as ui from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 handshake — remainder export names', () => {
  it('exposes board/dice/scores/preview/over/inject/name', () => {
    expect(typeof ui.renderBoard).toBe('function');
    expect(typeof ui.renderDice).toBe('function');
    expect(typeof ui.renderScores).toBe('function');
    expect(typeof ui.renderDivisionPreview).toBe('function');
    expect(typeof ui.renderGameOver).toBe('function');
    expect(typeof ui.injectRemainderIslandsStyles).toBe('function');
    expect(ui.getPlayerName('player1')).toBe('Blue');
    expect(ui.getPlayerName('player2')).toBe('Red');
  });
});
