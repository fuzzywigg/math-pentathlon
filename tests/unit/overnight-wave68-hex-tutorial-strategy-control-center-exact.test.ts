/**
 * Wave 68 leftover after tip/#334 — Hex strategy control-center exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial strategy control center', () => {
  it('strategy-tips locks Control the center li exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('Control the center of the board');
    expect(step?.message).toContain(
      'Block your opponent while building your own path'
    );
  });
});
