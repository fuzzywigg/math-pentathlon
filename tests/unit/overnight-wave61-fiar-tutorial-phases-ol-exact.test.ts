/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR phases ol exact labels.
 * Wave55 matches Movement Phase; deepen Placement Phase strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 61 fiar — tutorial phases ol exact', () => {
  it('phases message includes Placement and Movement strong labels', () => {
    const phases = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(phases?.message).toContain('<strong>Placement Phase:</strong>');
    expect(phases?.message).toContain('<strong>Movement Phase:</strong>');
    expect(phases?.highlightSelector).toBe('.fiar-board-container');
  });
});
