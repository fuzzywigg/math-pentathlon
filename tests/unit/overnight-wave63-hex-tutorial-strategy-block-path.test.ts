/**
 * Wave 63 leftover after #301 — Hex strategy Block while building residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 63 hex — tutorial strategy block path', () => {
  it('strategy-tips title; Block your opponent while building', () => {
    const tips = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.title).toBe('Strategy Tips');
    expect(tips?.message).toMatch(/Block your opponent while building your own path/);
    expect(tips?.position).toBe('center');
  });
});
