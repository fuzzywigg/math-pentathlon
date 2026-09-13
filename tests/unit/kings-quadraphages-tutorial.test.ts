import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('kingsQuadraphagesTutorial requiredAction wiring', () => {
  it('requires clicking the blue king cell on select-king', () => {
    const step = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'select-king'
    );
    expect(step?.highlightSelector).toBe('.cell[data-row="1"][data-col="5"]');
    expect(step?.requiredAction).toEqual({
      type: 'click-cell',
      row: 1,
      col: 5,
    });
  });

  it('requires clicking the destination cell on move-king', () => {
    const step = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'move-king'
    );
    expect(step?.highlightSelector).toBe('.cell[data-row="2"][data-col="5"]');
    expect(step?.requiredAction).toEqual({
      type: 'click-cell',
      row: 2,
      col: 5,
    });
  });

  it('keeps known step ids and select/move copy intact', () => {
    const ids = kingsQuadraphagesTutorial.steps.map((s) => s.id);
    expect(ids).toContain('select-king');
    expect(ids).toContain('move-king');
    expect(ids).toContain('welcome');
    expect(ids[0]).toBe('welcome');

    const select = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'select-king'
    );
    expect(select?.message).toMatch(/Blue King|tap your/i);

    const move = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'move-king'
    );
    expect(move?.message).toMatch(/green cell|one square down/i);
  });
});
