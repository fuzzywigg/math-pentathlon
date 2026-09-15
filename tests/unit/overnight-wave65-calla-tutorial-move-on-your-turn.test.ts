/**
 * Wave 65 leftover after tip/#315 — Calla how-to-move On your turn.
 * Wave64 locked Click/Drop/picked-up; On your turn leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial move on your turn', () => {
  it('locks On your turn lead-in', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.title).toBe('Making a Move');
    expect(step?.message).toContain('On your turn:');
  });
});
