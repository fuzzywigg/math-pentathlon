/**
 * Wave 60 leftover after tip/#279 — Ramrod strategy Set up captures leftover.
 * #289 locked Block/Higher only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

describe('Wave 60 ramrod — tutorial setup captures', () => {
  it('strategy-tips includes Set up captures for yourself', () => {
    const step = ramrodTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('Set up captures for yourself');
  });
});
