/**
 * Wave 22 — live tutorialManager runtime via controller startTutorial().
 * Distinct from waves 9–13 static selector wiring and wave 20 mode-matrix flags.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { tutorialManager } from '../../src/core/tutorial';

import {
  initGame as initHex,
  startTutorial as startHexTutorial,
  isTutorialActive as isHexTutorial,
} from '../../src/games/hex/game-controller';
import { hexTutorial } from '../../src/games/hex/tutorial';

import {
  initGame as initCalla,
  startTutorial as startCallaTutorial,
  isTutorialActive as isCallaTutorial,
} from '../../src/games/calla/game-controller';
import { callaTutorial } from '../../src/games/calla/tutorial';

import {
  initGame as initStar,
  startTutorial as startStarTutorial,
  isTutorialActive as isStarTutorial,
} from '../../src/games/star-track/game-controller';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';

import {
  initGame as initHag,
  startTutorial as startHagTutorial,
  isTutorialActive as isHagTutorial,
} from '../../src/games/hex-a-gone/game-controller';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

import {
  initGame as initKings,
  startTutorial as startKingsTutorial,
  isTutorialActive as isKingsTutorial,
} from '../../src/games/kings-quadraphages/game-controller';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

import {
  initGame as initFiar,
  startTutorial as startFiarTutorial,
  isTutorialActive as isFiarTutorial,
} from '../../src/games/fiar/game-controller';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

import {
  initGame as initQueens,
  startTutorial as startQueensTutorial,
  isTutorialActive as isQueensTutorial,
} from '../../src/games/queens-guards/game-controller';
import { queensGuardsTutorial } from '../../src/games/queens-guards/tutorial';

import {
  initGame as initJuggle,
  startTutorial as startJuggleTutorial,
  isTutorialActive as isJuggleTutorial,
} from '../../src/games/juggle/game-controller';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

import {
  initGame as initContig,
  startTutorial as startContigTutorial,
  isTutorialActive as isContigTutorial,
} from '../../src/games/contig-60/game-controller';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

import {
  initGame as initPent,
  startTutorial as startPentTutorial,
  isTutorialActive as isPentTutorial,
} from '../../src/games/pent-em-in/game-controller';
import { pentEmInTutorial } from '../../src/games/pent-em-in/tutorial';

import {
  initGame as initFab,
  startTutorial as startFabTutorial,
  isTutorialActive as isFabTutorial,
} from '../../src/games/fab-a-diffy/game-controller';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

import {
  initGame as initPrime,
  startTutorial as startPrimeTutorial,
  isTutorialActive as isPrimeTutorial,
} from '../../src/games/prime-gold/game-controller';
import { primeGoldTutorial } from '../../src/games/prime-gold/tutorial';

import {
  initGame as initFrac,
  startTutorial as startFracTutorial,
  isTutorialActive as isFracTutorial,
} from '../../src/games/frac-fact/game-controller';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

import {
  initGame as initPinball,
  startTutorial as startPinballTutorial,
  isTutorialActive as isPinballTutorial,
} from '../../src/games/fraction-pinball/game-controller';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';

import {
  initGame as initRemainder,
  startTutorial as startRemainderTutorial,
  isTutorialActive as isRemainderTutorial,
} from '../../src/games/remainder-islands/game-controller';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';

afterEach(() => {
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  document.body.innerHTML = '';
});

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const board = document.createElement('div');
  const status = document.createElement('div');
  document.body.appendChild(board);
  document.body.appendChild(status);
  return { board, status };
}

function mountContainer(): HTMLElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

describe('Wave 22 tutorial-runtime — Hex / Calla / Star start + navigate', () => {
  it('Hex startTutorial activates first step; next/prev walk config', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    expect(isHexTutorial()).toBe(false);

    startHexTutorial();
    expect(isHexTutorial()).toBe(true);
    expect(tutorialManager.getIsActive()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe(hexTutorial.steps[0].id);
    expect(tutorialManager.getTotalSteps()).toBe(hexTutorial.steps.length);
    expect(
      document.querySelector('.tutorial-overlay, .tutorial-tooltip')
    ).toBeTruthy();

    tutorialManager.nextStep();
    expect(tutorialManager.getCurrentStep()?.id).toBe(hexTutorial.steps[1].id);
    expect(tutorialManager.getCurrentStepIndex()).toBe(1);

    tutorialManager.prevStep();
    expect(tutorialManager.getCurrentStep()?.id).toBe(hexTutorial.steps[0].id);

    tutorialManager.exit();
    expect(isHexTutorial()).toBe(false);
    expect(tutorialManager.getCurrentStep()).toBeNull();
  });

  it('Calla / Star Track startTutorial match their config first ids', () => {
    const calla = mountPair();
    initCalla(calla.board, calla.status);
    startCallaTutorial();
    expect(isCallaTutorial()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe(
      callaTutorial.steps[0].id
    );

    const star = mountPair();
    initStar(star.board, star.status);
    startStarTutorial();
    expect(isStarTutorial()).toBe(true);
    expect(tutorialManager.getCurrentStep()?.id).toBe(
      starTrackTutorial.steps[0].id
    );
    expect(callaTutorial.id).not.toBe(starTrackTutorial.id);
  });
});

describe('Wave 22 tutorial-runtime — singleton replaces prior game tutorial', () => {
  it('Hex then Hex-a-Gone startTutorial swaps active config', () => {
    const hex = mountPair();
    initHex(hex.board, hex.status);
    startHexTutorial();
    expect(tutorialManager.getCurrentStep()?.id).toBe(hexTutorial.steps[0].id);

    const hag = mountPair();
    initHag(hag.board, hag.status);
    startHagTutorial();
    expect(isHagTutorial()).toBe(true);
    expect(isHexTutorial()).toBe(true); // shared manager still active
    expect(tutorialManager.getCurrentStep()?.id).toBe(
      hexAGoneTutorial.steps[0].id
    );
    expect(tutorialManager.getTotalSteps()).toBe(hexAGoneTutorial.steps.length);
  });
});

describe('Wave 22 tutorial-runtime — board-pair Division I–III controllers', () => {
  it('Kings / FIAR / Queens / Juggle / Contig / Pent activate and exit', () => {
    const cases: Array<{
      name: string;
      init: (b: HTMLElement, s: HTMLElement) => void;
      start: () => void;
      isActive: () => boolean;
      firstId: string;
      total: number;
    }> = [
      {
        name: 'kings',
        init: initKings,
        start: startKingsTutorial,
        isActive: isKingsTutorial,
        firstId: kingsQuadraphagesTutorial.steps[0].id,
        total: kingsQuadraphagesTutorial.steps.length,
      },
      {
        name: 'fiar',
        init: initFiar,
        start: startFiarTutorial,
        isActive: isFiarTutorial,
        firstId: fiarTutorial.steps[0].id,
        total: fiarTutorial.steps.length,
      },
      {
        name: 'queens',
        init: initQueens,
        start: startQueensTutorial,
        isActive: isQueensTutorial,
        firstId: queensGuardsTutorial.steps[0].id,
        total: queensGuardsTutorial.steps.length,
      },
      {
        name: 'juggle',
        init: initJuggle,
        start: startJuggleTutorial,
        isActive: isJuggleTutorial,
        firstId: juggleTutorial.steps[0].id,
        total: juggleTutorial.steps.length,
      },
      {
        name: 'contig',
        init: initContig,
        start: startContigTutorial,
        isActive: isContigTutorial,
        firstId: contig60Tutorial.steps[0].id,
        total: contig60Tutorial.steps.length,
      },
      {
        name: 'pent',
        init: initPent,
        start: startPentTutorial,
        isActive: isPentTutorial,
        firstId: pentEmInTutorial.steps[0].id,
        total: pentEmInTutorial.steps.length,
      },
    ];

    for (const c of cases) {
      if (tutorialManager.getIsActive()) tutorialManager.exit();
      document.body.innerHTML = '';
      const { board, status } = mountPair();
      c.init(board, status);
      expect(c.isActive()).toBe(false);
      c.start();
      expect(c.isActive()).toBe(true);
      expect(tutorialManager.getCurrentStep()?.id).toBe(c.firstId);
      expect(tutorialManager.getTotalSteps()).toBe(c.total);
      tutorialManager.nextStep();
      expect(tutorialManager.getCurrentStepIndex()).toBeGreaterThanOrEqual(1);
      tutorialManager.exit();
      expect(c.isActive()).toBe(false);
    }
  });
});

describe('Wave 22 tutorial-runtime — container controllers', () => {
  it('Fab / Prime / Frac / Pinball / Remainder startTutorial overlays', () => {
    const cases: Array<{
      init: (el: HTMLElement) => void;
      start: () => void;
      isActive: () => boolean;
      firstId: string;
    }> = [
      {
        init: (el) => {
          initFab(el);
        },
        start: startFabTutorial,
        isActive: isFabTutorial,
        firstId: fabADiffyTutorial.steps[0].id,
      },
      {
        init: (el) => {
          initPrime(el);
        },
        start: startPrimeTutorial,
        isActive: isPrimeTutorial,
        firstId: primeGoldTutorial.steps[0].id,
      },
      {
        init: initFrac,
        start: startFracTutorial,
        isActive: isFracTutorial,
        firstId: fracFactTutorial.steps[0].id,
      },
      {
        init: initPinball,
        start: startPinballTutorial,
        isActive: isPinballTutorial,
        firstId: fractionPinballTutorial.steps[0].id,
      },
      {
        init: initRemainder,
        start: startRemainderTutorial,
        isActive: isRemainderTutorial,
        firstId: remainderIslandsTutorial.steps[0].id,
      },
    ];

    for (const c of cases) {
      if (tutorialManager.getIsActive()) tutorialManager.exit();
      document.body.innerHTML = '';
      const el = mountContainer();
      c.init(el);
      c.start();
      expect(c.isActive()).toBe(true);
      expect(tutorialManager.getCurrentStep()?.id).toBe(c.firstId);
      expect(
        document.querySelector('.tutorial-tooltip, .tutorial-overlay')
      ).toBeTruthy();
      tutorialManager.exit();
      expect(c.isActive()).toBe(false);
    }
  });
});

describe('Wave 22 tutorial-runtime — walk to last step then exit', () => {
  it('Hex advances through all steps without throw; exit clears overlay', () => {
    const { board, status } = mountPair();
    initHex(board, status);
    startHexTutorial();
    const last = hexTutorial.steps.length - 1;
    for (let i = 0; i < last; i++) {
      tutorialManager.nextStep();
    }
    expect(tutorialManager.getCurrentStepIndex()).toBe(last);
    expect(tutorialManager.getCurrentStep()?.id).toBe(
      hexTutorial.steps[last].id
    );

    tutorialManager.exit();
    expect(tutorialManager.getIsActive()).toBe(false);
    expect(document.querySelector('.tutorial-highlight-ring')).toBeFalsy();
  });
});
