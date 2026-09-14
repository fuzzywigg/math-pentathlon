/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder active score scale. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject active score scale', () => {
  it('active score scale + uppercase name leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('.remainder-player-score.active');
    expect(css).toContain('scale(1.05)');
    expect(css).toContain('.remainder-player-name');
    expect(css).toContain('text-transform: uppercase');
  });
});
