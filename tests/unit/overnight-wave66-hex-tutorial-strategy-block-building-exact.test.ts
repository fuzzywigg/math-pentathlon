/**
 * Wave 66 leftover after tip/#316 — Hex strategy block-while-building exact.
 * Soft center/bridges; lock Block opponent li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 66 hex — tutorial strategy block building exact', () => {
  it('strategy Block opponent while building path li exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Block your opponent while building your own path</li>'
    );
    expect(step?.message).toContain(
      '<li>Create "bridges" - two pieces that can connect via two paths</li>'
    );
  });
});
