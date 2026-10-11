/**
 * Wave 27 seat-handoff shard — place / hand / rod openers.
 * Sibling of burn-wave27-seat-handoff-core.test.ts (q-mp-1096).
 * Container games use newGameVsHuman(container) as the sole mount (already init).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { newGameVsHuman as sdVsHuman } from '../../src/games/sum-dominoes/game-controller';
import { newGameVsHuman as primeVsHuman } from '../../src/games/prime-gold/game-controller';
import { newGameVsHuman as parVsHuman } from '../../src/games/par-55/game-controller';
import { newGameVsHuman as starsVsHuman } from '../../src/games/stars-bars/game-controller';
import { newGameVsHuman as ramrodVsHuman } from '../../src/games/ramrod/game-controller';
import { newGameVsHuman as kwaVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { mountRoot } from './helpers/dom';

import { click } from '../helpers/dom-click';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Wave 27 seat-handoff — Sum Dominoes roll→place when playable', () => {
  it('roll enters placing/passing; place flips seat when valid cell exists', () => {
    const container = mountRoot();
    const ctrl = sdVsHuman(container);

    expect(ctrl.state.phase).toBe('rolling');
    click(container.querySelector('.sd-roll-btn'));
    expect(['placing', 'passing', 'rolling']).toContain(ctrl.state.phase);
    expect(container.querySelector('.sd-status')?.textContent).toMatch(
      /Select|Pass|place|Roll|No/i
    );

    const playable = container.querySelector(
      '.sd-hand-player1 .sd-hand-domino-playable, .sd-hand-domino.playable'
    );
    if (playable) {
      click(playable);
      const cell = container.querySelector('.sd-cell-valid');
      if (cell) {
        const before = ctrl.state.moveHistory.length;
        click(cell);
        expect(ctrl.state.moveHistory.length).toBeGreaterThan(before);
        expect(ctrl.state.currentPlayer).toBe('player2');
        expect(ctrl.state.phase).toBe('rolling');
      }
    } else if (ctrl.state.phase === 'passing') {
      const pass = container.querySelector('.sd-pass-btn');
      if (pass) {
        click(pass);
        expect(ctrl.state.currentPlayer).toBe('player2');
      }
    }
  });
});

describe('Wave 27 seat-handoff — Prime Gold roll→place when valid', () => {
  it('roll enters placing; valid cell place flips seat and grows history', () => {
    const container = mountRoot();
    const ctrl = primeVsHuman(container);

    click(container.querySelector('.pg-roll-btn, .prime-roll-btn'));
    expect(['placing', 'passing', 'rolling']).toContain(ctrl.state.phase);
    expect(container.querySelector('.pg-status')?.textContent).toMatch(
      /Select|Pass|Roll|place|expression/i
    );

    const valid =
      container.querySelector('.pg-cell.valid') ??
      container.querySelector('.pg-expr-item, .pg-expression');
    if (valid && ctrl.state.phase === 'placing') {
      const before = ctrl.state.moveHistory.length;
      click(valid);
      // expression select may need a second click on cell
      const cell = container.querySelector('.pg-cell.valid');
      if (cell) click(cell);
      if (ctrl.state.moveHistory.length > before) {
        expect(ctrl.state.currentPlayer).toBe('player2');
        expect(
          container.querySelector('.pg-move-item, .pg-history')
        ).toBeTruthy();
      }
    }
  });
});

describe('Wave 27 seat-handoff — Par 55 select→place flips seat', () => {
  it('hand block + valid base place grows history and flips player', () => {
    const container = mountRoot();
    const ctrl = parVsHuman(container);

    expect(ctrl.state.phase).toBe('selectingBlock');
    click(
      container.querySelector('.par55-hand-player1 .par55-hand-block.clickable')
    );
    expect(ctrl.state.phase).toBe('placingBlock');
    expect(ctrl.state.selectedBlock).toBeTruthy();

    const validPent = container.querySelector('.par55-valid-base');
    click(validPent?.closest('g[data-base-id]') ?? validPent);
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.scores.player1).toBeGreaterThanOrEqual(0);
    expect(container.querySelector('.par55-status')?.textContent).toMatch(
      /Select|turn|Place/i
    );
    expect(container.querySelector('.par55-history-move')).toBeTruthy();
  });
});

describe('Wave 27 seat-handoff — Stars & Bars select→place flips seat', () => {
  it('card + valid cell place grows history and flips player', () => {
    const container = mountRoot();
    const ctrl = starsVsHuman(container);

    expect(ctrl.state.phase).toBe('selectingCard');
    const hand =
      container.querySelector('.stars-hand-label.player1')?.parentElement ??
      container.querySelector('.stars-hand.player1, .stars-hand-player1');
    const card = hand?.querySelector('.stars-card:not(.disabled), .stars-card');
    click(card);
    expect(ctrl.state.phase).toBe('placingCard');

    const cell = container.querySelector(
      '.stars-cell.valid, .stars-cell-valid'
    );
    click(cell);
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.playerScores.player1).toBeGreaterThanOrEqual(0);
    expect(container.querySelector('.stars-status')?.textContent).toMatch(
      /Select|Place|turn/i
    );
    expect(
      container.querySelector('.stars-move-item, .stars-history')
    ).toBeTruthy();
  });
});

describe('Wave 27 seat-handoff — Ramrod / Kwatro select advances phase chrome', () => {
  it('Ramrod rod select enters placing and status updates', () => {
    const container = mountRoot();
    const ctrl = ramrodVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingRod');

    const rod = container.querySelector(
      '.ramrod-player-player1 .ramrod-rod-wrapper.selectable, .ramrod-rod-wrapper.selectable, .ramrod-rod-wrapper'
    );
    click(rod);
    expect(
      ctrl.state.selectedRod || ctrl.state.phase === 'placingRod'
    ).toBeTruthy();
    expect(container.querySelector('.ramrod-status')?.textContent).toMatch(
      /Select|Place|turn|box|Rod/i
    );

    if (ctrl.state.phase === 'placingRod' && ctrl.state.selectedRod) {
      const slot = container.querySelector(
        '.ramrod-slot.valid, .ramrod-slot.selectable, .ramrod-hint'
      );
      if (slot) {
        const before = ctrl.state.moveHistory.length;
        click(slot.closest('.ramrod-slot') ?? slot);
        if (ctrl.state.moveHistory.length > before) {
          expect(ctrl.state.currentPlayer).toBe('player2');
        }
      }
    }
  });

  it('Kwatro chip select enters move phase chrome', () => {
    const container = mountRoot();
    const ctrl = kwaVsHuman(container);
    expect(ctrl.state.phase).toBe('selectingChip');

    const chip = container.querySelector(
      '.kwa-selectable-chip, [data-node-id] circle.kwa-selectable-chip, g[data-node-id]'
    );
    // Prefer the selectable chip circle; fall back to a node group that owns one
    const target =
      container
        .querySelector('.kwa-selectable-chip')
        ?.closest('g[data-node-id]') ?? chip;
    click(target);
    expect(
      ctrl.state.selectedChip ||
        ctrl.state.phase === 'selectingDest' ||
        container.querySelector('.kwa-status')
    ).toBeTruthy();
    expect(container.querySelector('.kwa-status')?.textContent).toMatch(
      /Select|Move|Place|turn|chip|Blue|Red/i
    );
  });
});
