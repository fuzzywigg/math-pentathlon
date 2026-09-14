/**
 * Wave 64 leftover after tip/#303 — Calla your-calla passing / score copy.
 * Wave63 locked store highlight; deepen passing/score leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial passing calla', () => {
  it('locks passing YOUR Calla and score stay fragments', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'your-calla');
    expect(step?.title).toBe('Your Calla');
    expect(step?.message).toContain('passing YOUR Calla');
    expect(step?.message).toContain("that's your score");
    expect(step?.message).toContain("opponent's Calla");
    expect(step?.position).toBe('left');
  });
});
