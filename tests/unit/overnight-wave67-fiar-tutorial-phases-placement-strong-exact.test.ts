/**
 * Wave 67 leftover after tip/#316 — FIAR phases Placement strong exact.
 * Wave61 ol soft; lock <strong>Placement Phase:</strong> leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial phases placement strong', () => {
  it('game-phases uses exact Placement Phase strong label', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(step?.message).toContain('<strong>Placement Phase:</strong>');
  });
});
