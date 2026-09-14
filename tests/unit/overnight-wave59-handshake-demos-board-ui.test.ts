/**
 * Wave 59 leftover after #281 — Handshake residual demos × queens/pent/prime/sum chrome.
 * Distinct from wave58 handshake Path found / True! / empty aria / role=grid. Tests-only.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { renderPolyominoDemo } from '../../src/demos/polyomino-demo';
import { createInitialState as queensInit } from '../../src/games/queens-guards/types';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { createInitialState as primeInit } from '../../src/games/prime-gold/rules';
import {
  injectQGStyles,
  renderBoard as renderQueens,
} from '../../src/games/queens-guards/board-ui';
import {
  injectPentEmInStyles,
  renderBoard as renderPent,
} from '../../src/games/pent-em-in/board-ui';
import {
  injectPrimeGoldStyles,
  renderDice as renderPrimeDice,
} from '../../src/games/prime-gold/board-ui';
import { injectSDStyles, renderDice as renderSumDice } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 59 handshake — demos/board-ui leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('qg-styles')?.remove();
    document.getElementById('pent-em-in-styles')?.remove();
    document.getElementById('sd-styles')?.remove();
  });

  it('mounts residual wave59 chrome across demos × board-ui', () => {
    injectQGStyles();
    injectPentEmInStyles();
    injectPrimeGoldStyles();
    injectSDStyles();
    expect(document.getElementById('qg-styles')?.textContent).toMatch(/@keyframes qg-glow/);
    expect(document.getElementById('pent-em-in-styles')?.textContent).toMatch(
      /\.pent-btn-flip/
    );

    const demos = document.createElement('div');
    document.body.appendChild(demos);
    renderAlignmentDemo(demos);
    expect(demos.querySelector('#potential-info')?.textContent).toMatch(
      /Click a cell to see alignment potential/
    );
    renderPolyominoDemo(demos);
    expect(demos.querySelector('#empty-count')?.textContent).toBe('Empty: 100');

    const q = renderQueens(queensInit(), () => undefined);
    expect(q.querySelector('[data-cell-key="5-16"]')?.getAttribute('aria-label')).toBe(
      'ring 5 pos 16, Red Guard'
    );

    const p = renderPent(pentInit(), () => undefined, () => undefined);
    expect(
      p.querySelector('.interaction [data-row="0"][data-col="0"]')?.getAttribute(
        'aria-label'
      )
    ).toBe('0,0, empty');

    expect(renderPrimeDice(primeInit(), () => undefined).querySelector('strong')?.textContent).toBe(
      "Blue's Turn"
    );
    expect(
      renderSumDice([2, 5], () => undefined, false).querySelector('.sd-dice-sum')
        ?.textContent
    ).toBe('= 7');
  });
});
