/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact welcome strong brand.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — welcome strong brand', () => {
  it('welcome message wraps Frac Fact in strong leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('<strong>Frac Fact</strong>');
  });
});
