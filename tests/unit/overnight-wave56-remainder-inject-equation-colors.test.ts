/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder equation colors CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject equation colors', () => {
  it('dividend/divisor/remainder/points colors leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('.dividend { color: #1976d2; }');
    expect(css).toContain('.divisor { color: #388e3c; }');
    expect(css).toContain('color: #d32f2f');
    expect(css).toContain('.points-preview');
    expect(css).toContain('color: #4caf50');
  });
});
