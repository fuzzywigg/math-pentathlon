/**
 * Wave 68 leftover after tip/#336 — Kwatro setup Blue Even chips exact li.
 * Wave63 soft Blue; deepen full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 68 kwatro — tutorial setup blue even exact', () => {
  it('setup lists Blue even chips exact', () => {
    const setup = kwatroSinkoTutorial.steps.find((s) => s.id === 'setup');
    expect(setup?.message).toContain(
      '<li><strong>Blue (Player 1):</strong> Even chips (0, 2, 4, 6, 8)</li>'
    );
  });
});
