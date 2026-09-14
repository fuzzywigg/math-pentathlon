/**
 * Wave 55 leftover after #249/#250 — FIAR tutorial welcome/phases/movement/winning. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 55 fiar — tutorial welcome phases', () => {
  it('covers FIAR four-in-a-row, 4 chips, movement, and win axes', () => {
    const welcome = fiarTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).toMatch(/FIAR \(Four In A Row\)/);
    expect(welcome?.message).toMatch(/four of your chips in a row/);

    const phases = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(phases?.message).toMatch(/4 chips each/);
    expect(phases?.message).toMatch(/Movement Phase/);
    expect(phases?.highlightSelector).toBe('.fiar-board-container');

    const move = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(move?.message).toMatch(/any distance/);
    expect(move?.message).toMatch(/Click your chip to select/);
    expect(move?.highlightSelector).toBe('.fiar-board-container');

    const winning = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/horizontal, vertical, or diagonal/);
    expect(winning?.message).toMatch(/Blocking/);
  });
});
