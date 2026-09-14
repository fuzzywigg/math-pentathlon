/**
 * Wave 57 leftover after #267 — Handshake demos × queens/sum/pent/prime leftovers.
 * Distinct from wave56 Blue Queen / A1 / Move History handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';
import { renderExpressionDemo } from '../../src/demos/expression-demo';
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
  renderBoard as renderPrime,
} from '../../src/games/prime-gold/board-ui';

describe('Wave 57 handshake — demos/board-ui leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('qg-styles')?.remove();
    document.getElementById('sd-styles')?.remove();
    document.getElementById('pent-em-in-styles')?.remove();
  });

  it('mounts leftover exact chrome across demos × board-ui', () => {
    injectQGStyles();
    injectSDStyles();
    injectPentEmInStyles();
    injectPrimeGoldStyles();
    expect(document.getElementById('qg-styles')?.textContent).toMatch(
      /\.qg-status\.player1/
    );
    expect(document.getElementById('sd-styles')?.textContent).toMatch(
      /\.sd-domino-vertical/
    );
    expect(document.getElementById('pent-em-in-styles')?.textContent).toMatch(
      /\.pent-btn-cancel/
    );

    const demos = document.createElement('div');
    document.body.appendChild(demos);
    renderGraphDemo(demos);
    expect(demos.querySelector('#path-status')?.textContent).toBe(
      'Click a node to set start point'
    );
    renderExpressionDemo(demos);
    const input = demos.querySelector('#equation-input') as HTMLInputElement;
    const check = demos.querySelector(
      '#check-equation-btn'
    ) as HTMLButtonElement;
    input.value = '2 + 2 = 4';
    check.click();
    expect(demos.querySelector('#equation-result')?.textContent).toBe(
      '✓ True! Both sides equal 4'
    );

    const q = renderQueens(queensInit(), () => undefined);
    expect(
      q.querySelector('[data-cell-key="0-0"]')?.getAttribute('aria-label')
    ).toBe('ring 0 pos 0, empty');

    const s = renderSum(sumInit(), () => undefined);
    expect(s.getAttribute('role')).toBe('grid');
    expect(
      s
        .querySelector('.sd-cell[data-row="10"][data-col="10"]')
        ?.getAttribute('aria-label')
    ).toBe('K11, empty');

    const p = renderPent(pentInit(), () => undefined, () => undefined);
    expect(
      p
        .querySelector('.interaction [data-row="0"][data-col="0"]')
        ?.getAttribute('aria-label')
    ).toBe('0,0, empty');

    const prime = renderPrime(primeInit(), () => undefined);
    const primeCell = prime.querySelector('.pg-cell.prime') as HTMLElement;
    expect(primeCell.getAttribute('aria-label')).toMatch(/empty, prime$/);
  });
});
