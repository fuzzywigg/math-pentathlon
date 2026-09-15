/**
 * Wave 68 leftover after tip/#336 — Kwatro setup Red Odd chips exact li.
 * Wave63 soft Red; deepen full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 68 kwatro — tutorial setup red odd exact', () => {
  it('setup lists Red odd chips exact', () => {
    const setup = kwatroSinkoTutorial.steps.find((s) => s.id === 'setup');
    expect(setup?.message).toContain(
      '<li><strong>Red (Player 2):</strong> Odd chips (1, 3, 5, 7, 9)</li>'
    );
  });
});
