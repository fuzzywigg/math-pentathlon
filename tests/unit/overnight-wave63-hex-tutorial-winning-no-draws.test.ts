/**
 * Wave 63 leftover after #301 — Hex winning no-draws-possible residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 63 hex — tutorial winning no draws', () => {
  it('winning message locks solved / no draws possible', () => {
    const winning = hexTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/no draws possible/);
    expect(winning?.message).toMatch(/solved game/);
  });
});
