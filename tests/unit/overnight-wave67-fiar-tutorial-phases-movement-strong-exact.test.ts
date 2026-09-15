/**
 * Wave 67 leftover after tip/#336 — FIAR phases Movement strong exact.
 * Wave61 ol soft; lock <strong>Movement Phase:</strong> leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial phases movement strong', () => {
  it('game-phases uses exact Movement Phase strong label', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(step?.message).toContain('<strong>Movement Phase:</strong>');
  });
});
