/**
 * Wave 56 leftover after #256 — Handshake demos × queens/sum/pent/prime board-ui.
 * Distinct from wave55 demos×juggle/ramrod and kings/hex/par handshakes. Tests-only.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { createInitialState as queensInit } from '../../src/games/queens-guards/types';
import { createInitialState as sumInit } from '../../src/games/sum-dominoes/rules';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { createInitialState as primeInit } from '../../src/games/prime-gold/rules';
import {
  injectQGStyles,
  renderBoard as renderQueens,
} from '../../src/games/queens-guards/board-ui';
import {
  injectSDStyles,
  renderBoard as renderSum,
} from '../../src/games/sum-dominoes/board-ui';
import {
  injectPentEmInStyles,
  renderBoard as renderPent,
} from '../../src/games/pent-em-in/board-ui';
import {
  injectPrimeGoldStyles,
  renderMoveHistory,
} from '../../src/games/prime-gold/board-ui';

describe('Wave 56 handshake — demos/board-ui leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('qg-styles')?.remove();
    document.getElementById('sd-styles')?.remove();
    document.getElementById('pent-em-in-styles')?.remove();
  });

  it('mounts demo chrome with queens/sum/pent/prime leftover selectors', () => {
    injectQGStyles();
    injectSDStyles();
    injectPentEmInStyles();
    injectPrimeGoldStyles();
    expect(document.getElementById('qg-styles')?.textContent).toMatch(
      /\.qg-winner-banner/
    );
    expect(document.getElementById('sd-styles')?.textContent).toMatch(
      /\.sd-cell-valid/
    );
    expect(document.getElementById('pent-em-in-styles')?.textContent).toMatch(
      /\.pent-winner-banner/
    );

    const demos = document.createElement('div');
    document.body.appendChild(demos);
    renderDiceDemo(demos);
    expect(demos.querySelector('#quick-roll-result')?.textContent).toMatch(
      /Click a button to roll/
    );
    renderAttributeDemo(demos);
    expect(demos.querySelector('#valid-sets-info')?.textContent).toMatch(
      /ALL the same or ALL different/
    );

    const q = renderQueens(queensInit(), () => undefined);
    expect(q.querySelector('[data-cell-key="5-7"]')?.getAttribute('aria-label')).toBe(
      'ring 5 pos 7, Blue Queen'
    );

    const s = renderSum(sumInit(), () => undefined);
    expect(
      s.querySelector('.sd-cell[data-row="0"][data-col="0"]')?.getAttribute(
        'aria-label'
      )
    ).toBe('A1, empty');

    const p = renderPent(pentInit(), () => undefined, () => undefined);
    expect(p.querySelector('.interaction [data-row="0"][data-col="0"]')).toBeTruthy();

    expect(renderMoveHistory(primeInit()).querySelector('h3')?.textContent).toBe(
      'Move History'
    );
  });
});
