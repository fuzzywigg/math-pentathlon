/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact Difficulty Levels title exact.
 * Wave52 matched /Difficulty/i only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — difficulty title', () => {
  it('Difficulty Levels title + Easy/Medium/Hard bullets leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'difficulty-levels');
    expect(step?.title).toBe('Difficulty Levels');
    expect(step?.position).toBe('center');
    expect(step?.message).toMatch(/<strong>Easy:<\/strong> Addition and subtraction/);
    expect(step?.message).toMatch(/<strong>Medium:<\/strong> Includes multiplication/);
    expect(step?.message).toMatch(/<strong>Hard:<\/strong> All operations including division/);
  });
});
