/**
 * Wave 60 leftover after tip/#279 — Calla how-to-move Drop 1 cube / Click a pit.
 * Distinct from wave58 titles. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 60 calla — tutorial drop one cube', () => {
  it('how-to-move lists Click a pit and Drop 1 cube', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.message).toContain('Click a pit');
    expect(step?.message).toContain('Drop 1 cube');
  });
});
