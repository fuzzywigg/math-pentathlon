/**
 * Wave 59 leftover after #272 — Frac Fact difficulty-levels step exact.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 59 frac — tutorial difficulty levels', () => {
  it('locks Easy/Medium/Hard level copy', () => {
    const step = fracFactTutorial.steps.find(
      (s) => s.id === 'difficulty-levels'
    );
    expect(step?.title).toBe('Difficulty Levels');
    expect(step?.message).toContain(
      '<li><strong>Easy:</strong> Addition and subtraction with simple fractions</li>'
    );
    expect(step?.message).toContain(
      '<li><strong>Medium:</strong> Includes multiplication</li>'
    );
    expect(step?.message).toContain(
      '<li><strong>Hard:</strong> All operations including division</li>'
    );
  });
});
