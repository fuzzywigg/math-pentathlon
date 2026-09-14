/**
 * Wave 53 leftover after #235 — Fab board-ui export names cross. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import * as ui from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 handshake — fab export names', () => {
  it('exposes render + inject + getPlayerName helpers', () => {
    expect(typeof ui.renderFractionBarPool).toBe('function');
    expect(typeof ui.renderAnswerBoard).toBe('function');
    expect(typeof ui.renderOperationSelector).toBe('function');
    expect(typeof ui.renderScores).toBe('function');
    expect(typeof ui.renderMoveHistory).toBe('function');
    expect(typeof ui.injectFabStyles).toBe('function');
    expect(typeof ui.getPlayerName).toBe('function');
    expect(ui.getPlayerName('player2')).toBe('Red');
  });
});
