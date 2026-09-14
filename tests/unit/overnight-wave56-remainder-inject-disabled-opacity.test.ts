/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder disabled opacity. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject disabled opacity', () => {
  it('disabled button opacity leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('.remainder-btn:disabled');
    expect(css).toContain('opacity: 0.5');
    expect(css).toContain('cursor: not-allowed');
  });
});
