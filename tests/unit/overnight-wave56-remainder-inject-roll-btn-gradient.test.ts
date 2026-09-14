/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder roll btn gradient. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject roll btn gradient', () => {
  it('roll button orange gradient + hover leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('.remainder-btn-roll');
    expect(css).toContain('#ff9800');
    expect(css).toContain('#f57c00');
    expect(css).toContain('scale(1.05)');
    expect(css).toContain('rgba(255,152,0,0.4)');
  });
});
