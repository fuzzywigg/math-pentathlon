/**
 * Wave 58 Contig/SD residual — Contig × Sum public export handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import * as contigCtrl from '../../src/games/contig-60/game-controller';
import * as sumCtrl from '../../src/games/sum-dominoes/game-controller';
import * as contigRules from '../../src/games/contig-60/rules';
import * as sumRules from '../../src/games/sum-dominoes/rules';

describe('Wave 58 handshake — contig × sum exports', () => {
  it('exposes init/newGame/tutorial + roll/pass/place families', () => {
    expect(typeof contigCtrl.initGame).toBe('function');
    expect(typeof contigCtrl.newGameVsAI).toBe('function');
    expect(typeof contigCtrl.setAIDifficulty).toBe('function');
    expect(typeof contigCtrl.startTutorial).toBe('function');
    expect(typeof sumCtrl.initGame).toBe('function');
    expect(typeof sumCtrl.newGameVsAI).toBe('function');
    expect(typeof sumCtrl.startTutorial).toBe('function');
    expect(typeof contigRules.doRollDice).toBe('function');
    expect(typeof contigRules.passTurn).toBe('function');
    expect(typeof sumRules.doRollDice).toBe('function');
    expect(typeof sumRules.passTurn).toBe('function');
    expect(typeof sumRules.formatMove).toBe('function');
  });
});
