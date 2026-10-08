/**
 * Overnight TOKENMAXX HEAVY leftover — Frac Fact tutorial copy / step catalog.
 * Prior wiring tests only checked highlightSelector ids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 54 frac tutorial — copy catalog', () => {
  it('id, name, and ordered step ids stay wired', () => {
    expect(fracFactTutorial.id).toBe('frac-fact-basics');
    expect(fracFactTutorial.name).toBe('Learn Frac Fact');
    expect(fracFactTutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'objective',
      'gameplay',
      'scoring',
      'difficulty-levels',
      'winning',
      'complete',
    ]);
  });

  it('scoring / difficulty / winning / complete copy and positions', () => {
    const byId = Object.fromEntries(
      fracFactTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId.scoring.message).toMatch(/10 points/);
    expect(byId.scoring.message).toMatch(/\+5 points/);
    expect(byId.scoring.highlightSelector).toBe('.frac-scores');
    expect(byId.scoring.position).toBe('bottom');
    expect(byId.gameplay.highlightSelector).toBe('.frac-problem');
    expect(byId.gameplay.position).toBe('bottom');
    expect(byId.gameplay.message).toMatch(/4 options/);
    expect(byId['difficulty-levels'].message).toMatch(/Addition and subtraction/);
    expect(byId['difficulty-levels'].message).toMatch(/multiplication/i);
    expect(byId['difficulty-levels'].message).toMatch(/division/i);
    expect(byId['difficulty-levels'].position).toBe('center');
    expect(byId.winning.message).toMatch(/10 problems/);
    expect(byId.complete.message).toMatch(/Finish/);
    expect(byId.welcome.position).toBe('center');
    expect(byId.welcome.highlightSelector).toBeUndefined();
    expect(byId.objective.highlightSelector).toBeUndefined();
    for (const step of fracFactTutorial.steps) {
      expect(step.requiredAction).toBeUndefined();
    }
  });
});
