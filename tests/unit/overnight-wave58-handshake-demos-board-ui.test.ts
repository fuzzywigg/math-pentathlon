/**
 * Wave 58 leftover after #267 — Handshake demos × queens/pent/prime residual chrome.
 * Distinct from wave56 handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderAttributeDemo } from '../../src/demos/attribute-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
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
  renderBoard as renderPrime,
} from '../../src/games/prime-gold/board-ui';

describe('Wave 58 handshake — demos/board-ui leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('qg-styles')?.remove();
    document.getElementById('pent-em-in-styles')?.remove();
  });

  it('mounts residual demo + queens/pent/prime chrome selectors', () => {
    injectQGStyles();
    injectPentEmInStyles();
    injectPrimeGoldStyles();
    expect(document.getElementById('qg-styles')?.textContent).toMatch(/\.qg-info/);
    expect(document.getElementById('pent-em-in-styles')?.textContent).toMatch(
      /\.pent-btn-cancel/
    );

    const demos = document.createElement('div');
    document.body.appendChild(demos);
    renderDiceDemo(demos);
    expect(demos.querySelector('h1')?.textContent).toMatch(/Dice System Demo/);
    renderAttributeDemo(demos);
    expect(
      demos.querySelector('.set-btn[data-set="basic"]')?.textContent
    ).toMatch(/Basic \(Shape\/Color\/Size\)/);
    renderAlignmentDemo(demos);
    expect(demos.querySelector('#potential-info')?.textContent).toMatch(
      /Click a cell to see alignment potential/
    );

    const q = renderQueens(queensInit(), () => undefined);
    expect(q.querySelector('[data-cell-key="0-0"]')?.getAttribute('aria-label')).toBe(
      'ring 0 pos 0, empty'
    );

    const p = renderPent(pentInit(), () => undefined, () => undefined);
    expect(
      p.querySelector('.interaction [data-row="0"][data-col="0"]')?.getAttribute(
        'aria-label'
      )
    ).toBe('0,0, empty');

    const pr = renderPrime(primeInit(), () => undefined);
    expect(pr.querySelector('.pg-cell[data-value="2"]')?.getAttribute('aria-label')).toBe(
      '2, empty, prime'
    );
  });
});
