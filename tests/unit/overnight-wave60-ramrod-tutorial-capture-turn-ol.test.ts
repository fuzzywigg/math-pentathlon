/**
 * Wave 60 leftover after tip/#279 — Ramrod capturing + turn-sequence body.
 * Distinct from #289 Block/Higher strategy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

describe('Wave 60 ramrod — tutorial capture turn ol', () => {
  it('locks target 5-10 and Select/Place/Capture strong tags', () => {
    const capture = ramrodTutorial.steps.find((s) => s.id === 'capturing-rules');
    const turn = ramrodTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(capture?.message).toContain('target value (5-10)');
    expect(turn?.message).toContain('Select Rod:</strong>');
    expect(turn?.message).toContain('Place Rod:</strong>');
    expect(turn?.message).toContain('Capture:</strong>');
  });
});
