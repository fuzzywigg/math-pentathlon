import { describe, it, expect } from 'vitest';
import { TutorialConfig } from '../../src/core/tutorial';

import { callaTutorial } from '../../src/games/calla/tutorial';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { juggleTutorial } from '../../src/games/juggle/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { par55Tutorial } from '../../src/games/par-55/tutorial';
import { pentEmInTutorial } from '../../src/games/pent-em-in/tutorial';
import { primeGoldTutorial } from '../../src/games/prime-gold/tutorial';
import { queensGuardsTutorial } from '../../src/games/queens-guards/tutorial';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

const tutorials: { name: string; config: TutorialConfig }[] = [
  { name: 'calla', config: callaTutorial },
  { name: 'fab-a-diffy', config: fabADiffyTutorial },
  { name: 'fiar', config: fiarTutorial },
  { name: 'frac-fact', config: fracFactTutorial },
  { name: 'fraction-pinball', config: fractionPinballTutorial },
  { name: 'hex', config: hexTutorial },
  { name: 'hex-a-gone', config: hexAGoneTutorial },
  { name: 'juggle', config: juggleTutorial },
  { name: 'kwatro-sinko', config: kwatroSinkoTutorial },
  { name: 'par-55', config: par55Tutorial },
  { name: 'pent-em-in', config: pentEmInTutorial },
  { name: 'prime-gold', config: primeGoldTutorial },
  { name: 'queens-guards', config: queensGuardsTutorial },
  { name: 'ramrod', config: ramrodTutorial },
  { name: 'remainder-islands', config: remainderIslandsTutorial },
  { name: 'stars-bars', config: starsBarsTutorial },
  { name: 'kings-quadraphages', config: kingsQuadraphagesTutorial },
];

describe('Existing games tutorials', () => {
  for (const { name, config } of tutorials) {
    describe(name, () => {
      it('has at least two steps with first/last ids', () => {
        expect(config.steps.length).toBeGreaterThanOrEqual(2);
        expect(config.steps[0].id).toBeTruthy();
        expect(config.steps[config.steps.length - 1].id).toBeTruthy();
      });

      it('has unique step ids', () => {
        const ids = config.steps.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('requiredAction steps have type and nonempty selector when click', () => {
        for (const step of config.steps) {
          if (!step.requiredAction) continue;
          expect(step.requiredAction.type).toBeTruthy();
          if (step.requiredAction.type === 'click') {
            expect(step.requiredAction.selector.length).toBeGreaterThan(0);
          }
        }
      });
    });
  }
});
