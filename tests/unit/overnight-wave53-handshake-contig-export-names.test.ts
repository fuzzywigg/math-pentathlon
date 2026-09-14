/**
 * Overnight HEAVY leftovers after #236 — Handshake contig leftover export names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import * as boardUi from '../../src/games/contig-60/board-ui';

describe('Wave 53 handshake — contig export names', () => {
  it('exposes leftover board-ui render/inject/name helpers', () => {
    expect(typeof boardUi.renderBoard).toBe('function');
    expect(typeof boardUi.renderDice).toBe('function');
    expect(typeof boardUi.renderExpressionSelector).toBe('function');
    expect(typeof boardUi.injectContigStyles).toBe('function');
    expect(typeof boardUi.getPlayerName).toBe('function');
  });
});
