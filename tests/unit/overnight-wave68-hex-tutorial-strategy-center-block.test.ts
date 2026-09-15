/**
 * Wave 68 leftover after tip/#336 — Hex strategy center + block LIs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial strategy center block', () => {
  it('strategy-tips locks Control center + Block opponent LIs', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('Control the center of the board');
    expect(step?.message).toContain('Block your opponent while building your own path');
    expect(step?.title).toBe('Strategy Tips');
  });
});
