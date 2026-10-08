/**
 * Wave 20 — container-style controller initGame / newGame / update / aiPlayer matrix.
 * Distinct from existing-games-controllers smoke and wave 19 remount/persist.
 * Covers Fab / Par / Stars / Ramrod / Kwatro / Prime / Sum. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  initGame as initFab,
  newGameVsHuman as fabVsHuman,
  newGameVsAI as fabVsAI,
  startTutorial as startFabTutorial,
  isTutorialActive as isFabTutorial,
} from '../../src/games/fab-a-diffy/game-controller';

import {
  initGame as initPar,
  newGameVsHuman as parVsHuman,
  newGameVsAI as parVsAI,
  startTutorial as startParTutorial,
  isTutorialActive as isParTutorial,
} from '../../src/games/par-55/game-controller';

import {
  initGame as initStars,
  newGameVsHuman as starsVsHuman,
  newGameVsAI as starsVsAI,
  startTutorial as startStarsTutorial,
  isTutorialActive as isStarsTutorial,
} from '../../src/games/stars-bars/game-controller';

import {
  initGame as initRamrod,
  newGameVsHuman as ramrodVsHuman,
  newGameVsAI as ramrodVsAI,
  startTutorial as startRamrodTutorial,
  isTutorialActive as isRamrodTutorial,
} from '../../src/games/ramrod/game-controller';

import {
  initGame as initKwa,
  newGameVsHuman as kwaVsHuman,
  newGameVsAI as kwaVsAI,
  startTutorial as startKwaTutorial,
  isTutorialActive as isKwaTutorial,
} from '../../src/games/kwatro-sinko/game-controller';

import {
  initGame as initPrime,
  newGameVsHuman as primeVsHuman,
  newGameVsAI as primeVsAI,
  startTutorial as startPrimeTutorial,
  isTutorialActive as isPrimeTutorial,
} from '../../src/games/prime-gold/game-controller';

import {
  initGame as initSum,
  newGameVsHuman as sumVsHuman,
  newGameVsAI as sumVsAI,
  startTutorial as startSumTutorial,
  isTutorialActive as isSumTutorial,
} from '../../src/games/sum-dominoes/game-controller';

import { tutorialManager } from '../../src/core/tutorial';
import { mountRoot } from './helpers/dom';

afterEach(() => {
  document.body.innerHTML = '';
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});


describe('Wave 20 container-api — initGame human vs AI flags', () => {
  it('Fab initGame(false) clears AI; initGame(true, hard) seats player2', () => {
    const human = initFab(mountRoot(), false);
    expect(human.isAI).toBe(false);
    expect(human.aiPlayer).toBeNull();
    expect(human.state.currentPlayer).toBe('player1');
    expect(human.state.moveHistory).toHaveLength(0);

    const ai = initFab(mountRoot(), true, 'hard');
    expect(ai.isAI).toBe(true);
    expect(ai.aiPlayer).toBe('player2');
    expect(ai.aiDifficulty).toBe('hard');
    expect(ai.state.currentPlayer).toBe('player1');
  });

  it('Par / Stars / Ramrod / Kwatro / Prime / Sum share aiPlayer contract', () => {
    const cases = [
      initPar(mountRoot(), true, 'easy'),
      initStars(mountRoot(), true, 'medium'),
      initRamrod(mountRoot(), true, 'hard'),
      initKwa(mountRoot(), true, 'easy'),
      initPrime(mountRoot(), true, 'medium'),
      initSum(mountRoot(), true, 'hard'),
    ];
    for (const ctrl of cases) {
      expect(ctrl.isAI).toBe(true);
      expect(ctrl.aiPlayer).toBe('player2');
      expect(['easy', 'medium', 'hard']).toContain(ctrl.aiDifficulty);
      expect(ctrl.state.currentPlayer).toBe('player1');
      expect(ctrl.state.moveHistory).toHaveLength(0);
    }

    const humans = [
      initPar(mountRoot(), false),
      initStars(mountRoot(), false),
      initRamrod(mountRoot(), false),
      initKwa(mountRoot(), false),
      initPrime(mountRoot(), false),
      initSum(mountRoot(), false),
    ];
    for (const ctrl of humans) {
      expect(ctrl.isAI).toBe(false);
      expect(ctrl.aiPlayer).toBeNull();
    }
  });
});

describe('Wave 20 container-api — newGame / update remount matrix', () => {
  it('Fab newGame flips AI flags and update remounts chrome', () => {
    const ctrl = fabVsHuman(mountRoot());
    expect(ctrl.isAI).toBe(false);
    ctrl.newGame(true, 'easy');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(ctrl.aiDifficulty).toBe('easy');
    expect(() => ctrl.update()).not.toThrow();
    expect(ctrl.container.innerHTML.length).toBeGreaterThan(0);
    ctrl.newGame(false);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();
    expect(ctrl.state.moveHistory).toHaveLength(0);
  });

  it('Par / Stars / Ramrod / Kwatro / Prime / Sum newGame + update stay stable', () => {
    const factories = [
      { vsHuman: parVsHuman, vsAI: parVsAI },
      { vsHuman: starsVsHuman, vsAI: starsVsAI },
      { vsHuman: ramrodVsHuman, vsAI: ramrodVsAI },
      { vsHuman: kwaVsHuman, vsAI: kwaVsAI },
      { vsHuman: primeVsHuman, vsAI: primeVsAI },
      { vsHuman: sumVsHuman, vsAI: sumVsAI },
    ];
    for (const { vsHuman, vsAI } of factories) {
      const ctrl = vsAI(mountRoot(), 'medium');
      expect(ctrl.isAI).toBe(true);
      expect(ctrl.aiPlayer).toBe('player2');
      ctrl.newGame(false);
      expect(ctrl.isAI).toBe(false);
      expect(ctrl.aiPlayer).toBeNull();
      expect(() => ctrl.update()).not.toThrow();
      expect(ctrl.container.querySelector('*')).not.toBeNull();
      const again = vsHuman(mountRoot());
      expect(again.isAI).toBe(false);
      again.newGame(true, 'hard');
      expect(again.aiDifficulty).toBe('hard');
      expect(again.state.currentPlayer).toBe('player1');
    }
  });
});

describe('Wave 20 container-api — tutorial then mode clear', () => {
  it('startTutorial then exit leaves isTutorialActive false for all seven', () => {
    const starters = [
      { mount: () => fabVsHuman(mountRoot()), start: startFabTutorial, active: isFabTutorial },
      { mount: () => parVsHuman(mountRoot()), start: startParTutorial, active: isParTutorial },
      {
        mount: () => starsVsHuman(mountRoot()),
        start: startStarsTutorial,
        active: isStarsTutorial,
      },
      {
        mount: () => ramrodVsHuman(mountRoot()),
        start: startRamrodTutorial,
        active: isRamrodTutorial,
      },
      { mount: () => kwaVsHuman(mountRoot()), start: startKwaTutorial, active: isKwaTutorial },
      {
        mount: () => primeVsHuman(mountRoot()),
        start: startPrimeTutorial,
        active: isPrimeTutorial,
      },
      { mount: () => sumVsHuman(mountRoot()), start: startSumTutorial, active: isSumTutorial },
    ];

    for (const entry of starters) {
      entry.mount();
      entry.start();
      expect(entry.active()).toBe(true);
      tutorialManager.exit();
      expect(entry.active()).toBe(false);
      expect(tutorialManager.getIsActive()).toBe(false);
    }
  });
});
