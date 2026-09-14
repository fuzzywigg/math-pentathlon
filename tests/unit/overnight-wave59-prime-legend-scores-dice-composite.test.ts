/**
 * Wave 59 leftover after #281 — Prime legend/scores/dice/?/composite/Valid Moves/pass-turn.
 * Distinct from wave58 empty-prime/owned+valid/shake-seat leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import {
  renderBoard,
  renderDice,
  renderExpressions,
  renderScores,
} from '../../src/games/prime-gold/board-ui';

describe('Wave 59 prime — legend scores dice composite', () => {
  it("locks legend spans, Blue's Turn ?, scores templates, Valid Moves, pass-turn, composite aria", () => {
    const board = renderBoard(createInitialState(), () => undefined);
    expect(
      [...board.querySelectorAll('.pg-legend-item span')].map((s) => s.textContent?.trim())
    ).toEqual(['Prime', 'Blue', 'Red']);
    expect(board.querySelector('.pg-cell[data-value="1"]')?.getAttribute('aria-label')).toBe(
      '1, empty'
    );

    const dice = renderDice(createInitialState(), () => undefined);
    expect(dice.querySelector('strong')?.textContent).toBe("Blue's Turn");
    expect([...dice.querySelectorAll('.pg-die')].map((d) => d.textContent)).toEqual([
      '?',
      '?',
      '?',
    ]);

    const scores = renderScores(createInitialState());
    expect(scores.querySelector('.pg-score.player1')?.textContent ?? '').toMatch(
      /Blue:\s*\d+\s*chips\s*\|\s*\d+\s*veins/
    );
    expect(scores.querySelector('.pg-score.player2')?.textContent ?? '').toMatch(
      /Red:\s*\d+\s*chips\s*\|\s*\d+\s*veins/
    );

    expect(renderExpressions(createInitialState(), () => undefined).querySelector('h3')?.textContent).toBe(
      'Valid Moves'
    );

    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [k, cell] of cells) {
      cells.set(k, { ...cell, owner: 'player1' });
    }
    const el = renderExpressions(
      {
        ...base,
        cells,
        phase: 'placing',
        diceRoll: { die1: 1, die2: 1, die3: 1 },
      },
      () => undefined
    );
    const line = [...el.querySelectorAll('div')].find((d) =>
      (d.textContent ?? '').includes('No valid moves')
    );
    expect(line?.textContent).toBe('No valid moves - pass turn');
  });
});
