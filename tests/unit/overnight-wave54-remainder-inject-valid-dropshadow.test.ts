/**
 * Overnight HEAVY leftover after #241 — inject CSS valid drop-shadow leftover. Tests-only.
 * Distinct from wave48 idempotent id-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => {
  document.getElementById('remainder-islands-styles')?.remove();
});

describe('Wave 54 remainder — inject valid shadow', () => {
  it('CSS includes valid polygon drop-shadow', () => {
    injectRemainderIslandsStyles();
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')!.textContent || '';
    expect(css).toContain('.island.valid polygon:first-child');
    expect(css).toContain('#ffeb3b');
  });
});
