/**
 * Wave 59 Contig/SD residual — Contig × Sum Roll Dice label handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice as contigDice } from '../../src/games/contig-60/board-ui';
import { renderDice as sumDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 handshake — roll labels', () => {
  it('both games label roll CTA Roll Dice', () => {
    expect(contigDice(null, () => undefined, true).querySelector('button')?.textContent).toBe(
      'Roll Dice'
    );
    expect(sumDice(null, () => undefined, true).querySelector('button')?.textContent).toBe(
      'Roll Dice'
    );
  });
});
