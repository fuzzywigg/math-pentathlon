/**
 * Wave 16 — AI null-gates / wrong-phase / wrong-seat / isAITurn matrix.
 * Distinct from waves 7–15 (win-draw terminals, secondary UI, tutorial wiring,
 * rules-phase illegal/getValid*, phase-format, clock edges).
 * Tests-only: chooser contracts return null when phase/seat wrong. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as jugglePlacement,
  isAITurn as juggleIsAI,
} from '../../src/games/juggle/ai';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  getAISelection,
  getAIPlacement as hagPlacement,
  isAITurn as hagIsAI,
} from '../../src/games/hex-a-gone/ai';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import { getAIMove as fabMove, isAITurn as fabIsAI } from '../../src/games/fab-a-diffy/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import {
  getAIChainChoice,
  isAITurn as starIsAI,
} from '../../src/games/star-track/ai';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  getAIIslandChoice,
  isAITurn as remIsAI,
} from '../../src/games/remainder-islands/ai';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import {
  getAIMove as sumMove,
  hasPlayableMove,
  isAITurn as sumIsAI,
} from '../../src/games/sum-dominoes/ai';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  getAIPlacement as contigPlacement,
  isAITurn as contigIsAI,
} from '../../src/games/contig-60/ai';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import {
  getAIPlacement as primePlacement,
  isAITurn as primeIsAI,
} from '../../src/games/prime-gold/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentMove, isAITurn as pentIsAI } from '../../src/games/pent-em-in/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parMove, isAITurn as parIsAI } from '../../src/games/par-55/ai';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  getAIMove as ramrodMove,
  isAITurn as ramrodIsAI,
} from '../../src/games/ramrod/ai';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import { getAIMove as kwaMove, isAITurn as kwaIsAI } from '../../src/games/kwatro-sinko/ai';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  getAIMove as starsMove,
  isAITurn as starsIsAI,
} from '../../src/games/stars-bars/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getAIMove as callaMove, isAITurn as callaIsAI } from '../../src/games/calla/ai';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { getAIMove as fiarMove } from '../../src/games/fiar/ai';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { getAIMove as queensMove } from '../../src/games/queens-guards/ai';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import { getAIAnswer as fracAnswer, isAITurn as fracIsAI } from '../../src/games/frac-fact/ai';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  getAIAnswer as pinAnswer,
  isAITurn as pinIsAI,
} from '../../src/games/fraction-pinball/ai';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  getAIMove as kingsMove,
  isAITurn as kingsIsAI,
} from '../../src/games/kings-quadraphages/ai';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 16 AI null-gates — Juggle / Hex-a-Gone / Fab', () => {
  it('Juggle choosers null on opening roll phase and wrong seat', () => {
    const opening = createJuggle();
    expect(opening.phase).toBe('rolling');
    expect(getAIDieChoice(opening, 'player1')).toBeNull();
    expect(getAIShapeChoice(opening, 'player1')).toBeNull();
    expect(jugglePlacement(opening, 'player1')).toBeNull();
    expect(getAIDieChoice(opening, 'player2')).toBeNull();
  });

  it('Juggle isAITurn requires human-vs-ai + matching seat + not gameOver', () => {
    const opening = createJuggle();
    expect(juggleIsAI(opening, 'player1', 'human-vs-human')).toBe(false);
    expect(juggleIsAI(opening, null, 'human-vs-ai')).toBe(false);
    expect(juggleIsAI(opening, 'player2', 'human-vs-ai')).toBe(false);
    expect(juggleIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
    const over = { ...opening, phase: 'gameOver' as const };
    expect(juggleIsAI(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('Hex-a-Gone getAIPlacement null in selectBlocks; selection null for wrong seat', () => {
    const opening = createHag();
    expect(opening.phase).toBe('selectBlocks');
    expect(hagPlacement(opening, 'player1')).toBeNull();
    expect(getAISelection(opening, 'player2')).toBeNull();
    expect(getAISelection(opening, 'player1')).not.toBeNull();
  });

  it('Hex-a-Gone isAITurn gates mode/seat/over', () => {
    const opening = createHag();
    expect(hagIsAI(opening, 'player1', 'human-vs-human')).toBe(false);
    expect(hagIsAI(opening, null, 'human-vs-ai')).toBe(false);
    expect(hagIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
  });

  it('Fab getAIMove null for wrong seat; isAITurn false in hvh', () => {
    const opening = createFab();
    expect(fabMove(opening, 'player2')).toBeNull();
    expect(fabMove(opening, 'player1')).not.toBeNull();
    expect(fabIsAI(opening, 'player1', 'human-vs-human')).toBe(false);
    expect(fabIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
    const over = { ...opening, phase: 'gameOver' as const };
    expect(fabMove(over, 'player1')).toBeNull();
    expect(fabIsAI(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});

describe('Wave 16 AI null-gates — Star / Remainder / Sum / Contig / Prime', () => {
  it('Star getAIChainChoice null before draw; isAITurn requires mode', () => {
    const opening = createStar();
    expect(opening.phase).toBe('drawChains');
    expect(getAIChainChoice(opening, 'player1')).toBeNull();
    expect(starIsAI(opening, 'player1', 'human-vs-human')).toBe(false);
    expect(starIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
  });

  it('Remainder getAIIslandChoice null while rolling / without roll', () => {
    const opening = createRemainder();
    expect(opening.phase).toBe('rolling');
    expect(getAIIslandChoice(opening, 'player1')).toBeNull();
    expect(remIsAI(opening, null)).toBe(false);
    expect(remIsAI(opening, 'player1')).toBe(true);
  });

  it('Sum getAIMove null without dice; hasPlayableMove false for impossible sum', () => {
    const opening = createSum();
    expect(opening.phase).toBe('rolling');
    expect(sumMove(opening, 'player1')).toBeNull();
    expect(hasPlayableMove(opening, 'player1', 99)).toBe(false);
    expect(sumIsAI(opening, null)).toBe(false);
    expect(sumIsAI(opening, 'player1')).toBe(true);
  });

  it('Contig getAIPlacement null while rolling', () => {
    const opening = createContig();
    expect(opening.phase).toBe('rolling');
    expect(contigPlacement(opening, 'player1')).toBeNull();
    expect(contigIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
    expect(contigIsAI(opening, 'player1', 'human-vs-human')).toBe(false);
  });

  it('Prime getAIPlacement null before roll / wrong seat', () => {
    const opening = createPrime();
    expect(primePlacement(opening, 'player1')).toBeNull();
    expect(primePlacement(opening, 'player2')).toBeNull();
    expect(primeIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
    expect(primeIsAI(opening, null, 'human-vs-ai')).toBe(false);
  });
});

describe('Wave 16 AI null-gates — Pent / Par / Ramrod / Kwatro / Stars', () => {
  it('Pent getAIMove null for wrong seat; isAITurn false without aiPlayer', () => {
    const opening = createPent();
    expect(pentMove(opening, 'player2')).toBeNull();
    expect(pentIsAI(opening, null)).toBe(false);
    expect(pentIsAI(opening, 'player1')).toBe(true);
  });

  it('Par / Ramrod / Kwatro / Stars wrong-seat null and isAITurn gates', () => {
    const par = createPar();
    expect(parMove(par, 'player2')).toBeNull();
    expect(parIsAI(par, 'player1', 'human-vs-ai')).toBe(true);
    expect(parIsAI(par, 'player1', 'human-vs-human')).toBe(false);

    const ram = createRamrod();
    expect(ramrodMove(ram, 'player2')).toBeNull();
    expect(ramrodIsAI(ram, 'player1', 'human-vs-ai')).toBe(true);

    const kwa = createKwa();
    expect(kwaMove(kwa, 'player2')).toBeNull();
    expect(kwaIsAI(kwa, null, 'human-vs-ai')).toBe(false);
    expect(kwaIsAI(kwa, 'player1', 'human-vs-ai')).toBe(true);

    const stars = createStars();
    expect(starsMove(stars, 'player2')).toBeNull();
    expect(starsIsAI(stars, 'player1', 'human-vs-human')).toBe(false);
    expect(starsIsAI(stars, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Wave 16 AI null-gates — Calla / FIAR / Queens / Hex / Kings', () => {
  it('Calla getAIMove null for wrong seat; isAITurn requires mode', () => {
    const opening = createCalla();
    expect(callaMove(opening, 'player2')).toBeNull();
    expect(callaMove(opening, 'player1')).not.toBeNull();
    expect(callaIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
    expect(callaIsAI(opening, 'player1', 'human-vs-human')).toBe(false);
  });

  it('FIAR getAIMove returns place-type on opening placement phase', () => {
    const opening = createFiar();
    expect(opening.phase).toBe('placement');
    const move = fiarMove(opening, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(move!.nodeId).toBeTruthy();
    // Malformed apply path covered in pipeline file; chooser always returns place|null here
    const easy2 = fiarMove(opening, 'player2', 'easy');
    expect(easy2 === null || easy2.type === 'place').toBe(true);
  });

  it('Queens getAIMove returns a legal from/to for current seat', () => {
    const opening = createQueens();
    const move = queensMove(opening, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.from).toBeTruthy();
    expect(move!.to).toBeTruthy();
    expect(queensMove(opening, 'player2')).toBeNull();
  });

  it('Hex getBestMove / getRandomMove nonempty on opening', () => {
    const opening = createHex();
    const best = getBestMove(opening, 'player1', 'easy');
    const random = getRandomMove(opening);
    expect(best).not.toBeNull();
    expect(random).not.toBeNull();
    expect(typeof best!.row).toBe('number');
    expect(typeof random!.col).toBe('number');
  });

  it('Kings getAIMove / isAITurn on opening moveKing phase', () => {
    const opening = createKings();
    expect(opening.turnPhase).toBe('moveKing');
    const move = kingsMove(opening, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.kingMove).toBeTruthy();
    expect(kingsIsAI(opening, 'player1', 'human-vs-ai')).toBe(true);
    expect(kingsIsAI(opening, null, 'human-vs-ai')).toBe(false);
  });
});

describe('Wave 16 AI null-gates — Frac Fact / Fraction Pinball', () => {
  it('Frac getAIAnswer null without currentProblem', () => {
    const opening = createFrac();
    expect(opening.currentProblem).toBeNull();
    expect(fracAnswer(opening, 'player1')).toBeNull();
    expect(fracIsAI(opening, 'player1')).toBe(true);
    expect(fracIsAI(opening, null)).toBe(false);
  });

  it('Pinball getAIAnswer null without currentChallenge', () => {
    const opening = createPinball();
    expect(opening.phase).toBe('answering');
    expect(opening.currentChallenge).toBeNull();
    expect(pinAnswer(opening, 'player1')).toBeNull();
    expect(pinIsAI(opening, 'player1')).toBe(true);
  });
});
