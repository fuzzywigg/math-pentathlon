/**
 * Wave 65 leftover after tip/#315 — Calla board-intro each-player Calla.
 * Wave64 locked Red pits / right side; deepen strong-Calla clause. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial board each player calla', () => {
  it('locks Each player has a strong-Calla clause', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain('Each player has a <strong>Calla</strong>');
    expect(step?.highlightSelector).toBe('.calla-board');
  });
});
