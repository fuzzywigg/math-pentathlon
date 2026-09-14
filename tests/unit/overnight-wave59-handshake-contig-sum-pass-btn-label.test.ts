/**
 * Wave 59 Contig/SD residual — Contig × Sum Pass Turn label handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';
import { createInitialState as sumInit } from '../../src/games/sum-dominoes/rules';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

describe('Wave 59 handshake — Pass Turn labels', () => {
  it('both games use Pass Turn CTA text', () => {
    const cells = new Map(contigInit().cells);
    for (const [id, cell] of cells) cells.set(id, { ...cell, owner: 'player2' });
    const contigEl = renderExpressionSelector(
      {
        ...contigInit(),
        cells,
        phase: 'calculating',
        currentDice: [1, 1, 1],
      },
      () => undefined,
      () => undefined
    );
    expect(contigEl.querySelector('.contig-pass-btn')?.textContent).toBe(
      'Pass Turn'
    );

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = { ...ctrl.state, phase: 'passing' };
    ctrl.update();
    expect(root.querySelector('.sd-pass-btn')?.textContent).toBe('Pass Turn');
    document.body.innerHTML = '';
    document.getElementById('sd-styles')?.remove();
    void sumInit;
  });
});
