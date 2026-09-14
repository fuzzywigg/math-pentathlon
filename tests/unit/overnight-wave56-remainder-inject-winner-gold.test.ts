/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder winner gold CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject winner gold', () => {
  it('winner banner gold gradient leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('.remainder-winner-banner');
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffb700)');
  });
});
