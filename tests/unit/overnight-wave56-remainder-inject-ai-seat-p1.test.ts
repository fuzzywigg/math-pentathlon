/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder AI seat p1 CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject AI seat p1', () => {
  it('AI-as-p1 status purple/red swap leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('[data-opponent="ai"][data-ai-seat="player1"] .remainder-status.player1');
    expect(css).toContain('background: #ede9fe');
    expect(css).toContain('[data-opponent="ai"][data-ai-seat="player1"] .remainder-status.player2');
    expect(css).toContain('background: #ffebee');
  });
});
