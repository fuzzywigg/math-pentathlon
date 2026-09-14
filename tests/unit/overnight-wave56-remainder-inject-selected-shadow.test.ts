/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder selected shadow CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => document.getElementById('remainder-islands-styles')?.remove());

describe('Wave 56 remainder — inject selected shadow', () => {
  it('selected island white drop-shadow leftover', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toContain('.island.selected polygon:first-child');
    expect(css).toContain('drop-shadow(0 0 12px #fff)');
  });
});
