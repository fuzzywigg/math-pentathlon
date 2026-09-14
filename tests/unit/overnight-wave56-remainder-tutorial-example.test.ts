/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder tutorial example. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';

describe('Wave 56 remainder — tutorial example', () => {
  it('example 7÷3 R1 + board highlight leftover', () => {
    const step = remainderIslandsTutorial.steps.find((s) => s.id === 'example');
    expect(step?.message).toMatch(/7 ÷ 3 = 2 R1 → Score 1 point/);
    expect(step?.highlightSelector).toBe('.remainder-board');
  });
});
