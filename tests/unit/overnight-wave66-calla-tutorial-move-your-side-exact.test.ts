/**
 * Wave 66 leftover after tip/#316 — Calla how-to-move YOUR side exact.
 * Soft Click a pit existed; lock YOUR side leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 66 calla — tutorial move your side exact', () => {
  it('how-to-move lists Click a pit on YOUR side', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'how-to-move');
    expect(step?.message).toContain('<li><strong>Click a pit</strong> on YOUR side</li>');
  });
});
