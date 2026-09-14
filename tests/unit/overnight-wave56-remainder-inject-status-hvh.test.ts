/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder status HvH CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject status HvH', () => {
  it('player1/player2 status backgrounds leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('.remainder-status.player1');
    expect(css).toContain('background: #e3f2fd');
    expect(css).toContain('.remainder-status.player2');
    expect(css).toContain('background: #ffebee');
  });
});
