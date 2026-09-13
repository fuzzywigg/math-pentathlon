import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import {
  renderMoveHistory as renderPrimeHistory,
  renderScores as renderPrimeScores,
  getPlayerName as primeName,
  renderDice as renderPrimeDice,
} from '../../src/games/prime-gold/board-ui';

import { createRod } from '../../src/games/ramrod/types';
import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  renderMoveHistory as renderRamrodHistory,
  renderScores as renderRamrodScores,
  renderRodLegend,
  getPlayerName as ramrodName,
} from '../../src/games/ramrod/board-ui';

import {
  Domino,
  PlacedDomino,
  SumDominoesState,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';
import { canPlayDomino } from '../../src/games/sum-dominoes/rules';
import {
  renderHand,
  renderDice as renderSdDice,
  getPlayerName as sdName,
} from '../../src/games/sum-dominoes/board-ui';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';
import {
  renderDice as renderContigDice,
  renderExpressionSelector,
  getPlayerName as contigName,
} from '../../src/games/contig-60/board-ui';

import {
  createInitialState as createKwa,
  selectChip,
} from '../../src/games/kwatro-sinko/rules';
import {
  renderChipInfo,
  renderMoveHistory as renderKwaHistory,
  getPlayerName as kwaName,
} from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { renderStatus as renderHexStatus } from '../../src/games/hex/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderStatus as renderCallaStatus } from '../../src/games/calla/board-ui';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
} from '../../src/games/fab-a-diffy/rules';
import {
  renderOperationSelector,
  getPlayerName as fabName,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import {
  renderDice as renderJuggleDice,
  renderShapeControls,
  getPlayerName as juggleName,
} from '../../src/games/juggle/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import {
  getPlayerName as fiarName,
  getPlayerColor,
} from '../../src/games/fiar/board-ui';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  renderHand as renderParHand,
  getPlayerName as parName,
} from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptySumBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: SD_CFG.BOARD_SIZE }, () =>
    Array.from({ length: SD_CFG.BOARD_SIZE }, () => null)
  );
}

function placeOnBoard(
  board: (PlacedDomino | null)[][],
  domino: Domino,
  row: number,
  col: number
): void {
  const placed: PlacedDomino = {
    domino: { ...domino, orientation: 'horizontal' },
    position: { row, col },
    orientation: 'horizontal',
  };
  board[row][col] = placed;
  board[row][col + 1] = placed;
}

describe('Burn wave 8 — Prime Gold secondary UI', () => {
  it('renderScores and empty history mount shells', () => {
    const state = createPrime();
    const scores = renderPrimeScores(state);
    const history = renderPrimeHistory(state);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    expect(scores.classList.contains('pg-scores')).toBe(true);
    expect(history.classList.contains('pg-move-history')).toBe(true);
    expect(primeName('player1').length).toBeGreaterThan(0);
  });

  it('non-empty moveHistory lists expression text', () => {
    const state = {
      ...createPrime(),
      moveHistory: [
        {
          player: 'player1' as const,
          dice: { die1: 2, die2: 3, die3: 2 },
          expression: '2×3×2',
          result: 12,
          row: 0,
          col: 1,
        },
      ],
    };
    const el = renderPrimeHistory(state);
    document.body.appendChild(el);
    expect(el.textContent).toMatch(/12|2×3×2|Blue/i);
  });

  it('renderDice shows faces when state has a roll', () => {
    const state = {
      ...createPrime(),
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 5 },
    };
    const el = renderPrimeDice(state, () => {});
    document.body.appendChild(el);
    expect(el.classList.contains('pg-dice-area')).toBe(true);
    expect(el.querySelectorAll('.pg-die').length).toBe(3);
  });
});

describe('Burn wave 8 — Ramrod secondary UI', () => {
  it('renderScores shows goal chrome and names', () => {
    const scores = renderRamrodScores(createRamrod());
    document.body.appendChild(scores);
    expect(scores.classList.contains('ramrod-scores')).toBe(true);
    expect(scores.textContent).toMatch(/24|Goal|cm/i);
    expect(ramrodName('player2').length).toBeGreaterThan(0);
  });

  it('non-empty capture history lists injected moves', () => {
    const rod = createRod('cap-1', 5);
    rod.owner = 'player1';
    const state = {
      ...createRamrod(),
      moveHistory: [
        {
          player: 'player1' as const,
          rod,
          boxId: '0-0',
          slot: 0,
          capturedBox: true,
          pointsScored: 5,
          moveNumber: 1,
        },
      ],
    };
    const el = renderRamrodHistory(state);
    document.body.appendChild(el);
    expect(el.classList.contains('ramrod-history')).toBe(true);
    expect(el.textContent).toMatch(/5|Blue|captured|cm/i);
  });

  it('renderRodLegend mounts stable class', () => {
    const legend = renderRodLegend();
    document.body.appendChild(legend);
    expect(legend.classList.contains('ramrod-legend')).toBe(true);
  });
});

describe('Burn wave 8 — Sum Dominoes hand playable marking', () => {
  it('marks playable class only for canPlayDomino=true hand tiles', () => {
    const board = emptySumBoard();
    placeOnBoard(board, makeDomino('seed', 6, 6, null), 5, 5);
    const state: SumDominoesState = {
      board,
      hands: {
        player1: [
          makeDomino('a', 2, 2),
          makeDomino('b', 1, 1),
          makeDomino('c', 5, 3),
        ],
        player2: [makeDomino('p2', 4, 4, 'player2')],
      },
      currentPlayer: 'player1',
      currentDice: [4, 4],
      selectedDomino: null,
      phase: 'placing',
      passCount: 0,
      winner: null,
      moveHistory: [],
    };
    const sum = 8;
    const expectedPlayable = state.hands.player1.filter((d) =>
      canPlayDomino(state, d, sum)
    ).length;
    const hand = renderHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(hand.querySelectorAll('.sd-hand-domino').length).toBe(3);
    expect(hand.querySelectorAll('.sd-hand-domino-playable').length).toBe(
      expectedPlayable
    );
    expect(sdName('player1').length).toBeGreaterThan(0);
  });

  it('renderDice shows roll CTA when canRoll', () => {
    const el = renderSdDice(null, () => {}, true);
    document.body.appendChild(el);
    expect(el.querySelector('.sd-roll-btn')).toBeTruthy();
  });
});

describe('Burn wave 8 — Contig dice + expression chrome', () => {
  it('renderDice after roll shows faces', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const rolled = doRollDice(createContig());
    const el = renderContigDice(rolled.currentDice, () => {}, false);
    document.body.appendChild(el);
    expect(el.classList.contains('contig-dice-area')).toBe(true);
    expect(
      el.querySelectorAll('.contig-die, .die-face').length
    ).toBeGreaterThan(0);
    expect(contigName('player2').length).toBeGreaterThan(0);
  });

  it('expression selector mounts when calculating with dice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const rolled = doRollDice(createContig());
    expect(rolled.phase).toBe('calculating');
    const el = renderExpressionSelector(
      rolled,
      () => {},
      () => {}
    );
    document.body.appendChild(el);
    expect(el.classList.contains('contig-expressions')).toBe(true);
    expect(
      el.querySelector('.contig-pass-btn, .contig-expr-btn, button')
    ).toBeTruthy();
  });
});

describe('Burn wave 8 — Kwatro chip info after select', () => {
  it('renderChipInfo after selectChip still mounts info shell', () => {
    let state = createKwa();
    const chipId = [...state.chips.keys()].find((id) => id.startsWith('p1-'))!;
    state = selectChip(state, chipId);
    expect(state.selectedChip).toBe(chipId);
    const chip = state.chips.get(chipId)!;
    const info = renderChipInfo(state);
    const history = renderKwaHistory({
      ...state,
      moveHistory: [
        {
          player: 'player1' as const,
          chip,
          fromNode: chip.position!,
          toNode: 'n1-1',
          alignment: null,
          moveNumber: 1,
        },
      ],
    });
    document.body.appendChild(info);
    document.body.appendChild(history);
    expect(info.classList.contains('kwa-chip-info')).toBe(true);
    expect(history.textContent?.length).toBeGreaterThan(0);
    expect(kwaName('player1').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 8 — Hex / Calla / Star human-vs-human winner labels', () => {
  it('Hex winner status uses player names without You/AI in hvh', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexStatus(
      {
        ...createHex(5),
        phase: 'gameOver',
        winner: 'player1',
      },
      container,
      'human-vs-human'
    );
    expect(container.querySelector('.hex-status')).toBeTruthy();
    expect(container.textContent).toMatch(/Blue|Wins|Player/i);
    expect(container.textContent).not.toMatch(/\bYou\b/);
  });

  it('Calla winner status in hvh avoids You/AI wording', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderCallaStatus(
      {
        ...createCalla(),
        phase: 'gameOver',
        winner: 'player2',
      },
      container,
      'human-vs-human'
    );
    expect(container.textContent).toMatch(/Red|Wins|Player/i);
    expect(container.textContent).not.toMatch(/\bAI\b/);
  });

  it('Star Track hvh winner shows progress without You label', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderStarStatus(
      {
        ...createStar(),
        phase: 'gameOver',
        winner: 'player1',
        player1Position: TRACK_LENGTH,
      },
      container,
      'human-vs-human'
    );
    expect(container.querySelector('.status-winner')).toBeTruthy();
    expect(container.textContent).not.toMatch(/\bYou\b/);
  });
});

describe('Burn wave 8 — Fab ops / Juggle dice / FIAR names / Par hand', () => {
  it('Fab renderOperationSelector mounts when two bars selected', () => {
    let state = createFab();
    const bars = Array.from(state.fractionBars.keys());
    state = selectBar1(state, bars[0]!);
    state = selectBar2(state, bars[1]!);
    expect(state.phase).toBe('selectingOperation');
    const el = renderOperationSelector(state, () => {});
    document.body.appendChild(el);
    expect(el.classList.contains('fab-operation-selector')).toBe(true);
    expect(
      el.querySelectorAll('.fab-op-btn, .fab-op-valid').length
    ).toBeGreaterThan(0);
    expect(fabName('player1').length).toBeGreaterThan(0);
  });

  it('Juggle renderDice and empty shape-controls shell mount', () => {
    const state = createJuggle();
    const dice = renderJuggleDice(
      [2, 3],
      () => {},
      () => {},
      false,
      'selectingShape'
    );
    // Without selectedShape, controls stay an empty shell (no canvas preview)
    const controls = renderShapeControls(
      state,
      () => {},
      () => {}
    );
    document.body.appendChild(dice);
    document.body.appendChild(controls);
    expect(dice.classList.contains('juggle-dice-area')).toBe(true);
    expect(controls.classList.contains('juggle-shape-controls')).toBe(true);
    expect(controls.querySelector('.juggle-current-shape')).toBeNull();
    expect(juggleName('player2').length).toBeGreaterThan(0);
  });

  it('FIAR getPlayerName / getPlayerColor return non-empty strings', () => {
    expect(fiarName('player1').length).toBeGreaterThan(0);
    expect(fiarName('player2').length).toBeGreaterThan(0);
    expect(getPlayerColor('player1').length).toBeGreaterThan(0);
    expect(getPlayerColor('player2').length).toBeGreaterThan(0);
    expect(createFiar().phase).toBe('placement');
  });

  it('Par renderHand mounts blocks for current player', () => {
    const state = createPar();
    const hand = renderParHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(hand.classList.contains('par55-hand')).toBe(true);
    expect(hand.children.length).toBeGreaterThan(0);
    expect(parName('player1').length).toBeGreaterThan(0);
  });
});
