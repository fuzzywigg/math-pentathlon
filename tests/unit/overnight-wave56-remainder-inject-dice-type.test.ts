/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder dice type sizes. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject dice type', () => {
  it('die icon 48px + total 36px cream leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('font-size: 48px');
    expect(css).toContain('.dice-total');
    expect(css).toContain('font-size: 36px');
    expect(css).toContain('#fff3e0');
  });
});
