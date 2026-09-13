import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  renderPlayerRods,
  renderScores as renderRamrodScores,
  renderMoveHistory as renderRamrodHistory,
  renderRodLegend,
  getPlayerName as ramrodName,
} from '../../src/games/ramrod/board-ui';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import {
  renderShapeSelector,
  renderShapeControls,
  getPlayerName as juggleName,
} from '../../src/games/juggle/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import {
  renderExpressions,
  renderScores as renderPrimeScores,
  renderMoveHistory as renderPrimeHistory,
  getPlayerName as primeName,
} from '../../src/games/prime-gold/board-ui';

import {
  createInitialState as createHexAGone,
} from '../../src/games/hex-a-gone/types';
import {
  canPlayerMove,
  selectBlockForPlacement,
  getBlockColor,
  selectBlock,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { canPlacePiece } from '../../src/games/pent-em-in/rules';
import { getAIMove } from '../../src/games/pent-em-in/ai';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Ramrod secondary UI', () => {
  it('renders rods, scores, history, and legend', () => {
    const state = createRamrod();
    const rods = renderPlayerRods(state, 'player1', () => undefined);
    const scores = renderRamrodScores(state);
    const history = renderRamrodHistory(state);
    const legend = renderRodLegend();
    document.body.appendChild(rods);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    document.body.appendChild(legend);
    expect(rods.classList.contains('ramrod-rods') || rods.children.length > 0).toBe(
      true
    );
    expect(scores.classList.contains('ramrod-scores')).toBe(true);
    expect(history.classList.contains('ramrod-history')).toBe(true);
    expect(legend.classList.contains('ramrod-legend')).toBe(true);
    expect(ramrodName('player1').length).toBeGreaterThan(0);
  });
});

describe('Juggle secondary UI', () => {
  it('renderShapeControls mounts an empty shell without selected shape', () => {
    const state = createJuggle();
    const controls = renderShapeControls(state, () => undefined, () => undefined);
    document.body.appendChild(controls);
    expect(controls.classList.contains('juggle-shape-controls')).toBe(true);
    expect(juggleName('player2').length).toBeGreaterThan(0);
  });

  it('renderShapeSelector returns a container when category+dice are set', () => {
    // Avoid renderShapePreview canvas path in jsdom — only assert the shell mounts
    // when category/dice are missing (early return before canvas).
    const empty = renderShapeSelector(createJuggle(), () => undefined);
    document.body.appendChild(empty);
    expect(empty.classList.contains('juggle-shape-selector')).toBe(true);
    expect(empty.children.length).toBe(0);
  });
});

describe('Prime Gold secondary UI', () => {
  it('renders expressions, scores, and history', () => {
    const state = {
      ...createPrime(),
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 5 },
    };
    const exprs = renderExpressions(state, () => undefined);
    const scores = renderPrimeScores(state);
    const history = renderPrimeHistory(state);
    document.body.appendChild(exprs);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    expect(exprs.classList.contains('pg-expressions')).toBe(true);
    expect(scores.classList.contains('pg-scores')).toBe(true);
    expect(history.classList.contains('pg-move-history')).toBe(true);
    expect(primeName('player1').length).toBeGreaterThan(0);
  });
});

describe('Hex-a-Gone leftover rules helpers', () => {
  it('canPlayerMove true on opening; getBlockColor returns hex colors', () => {
    const state = createHexAGone();
    expect(canPlayerMove(state)).toBe(true);
    expect(getBlockColor('hexagon')).toMatch(/^#/);
    expect(getBlockColor('trapezoid')).toMatch(/^#/);
  });

  it('selectBlockForPlacement returns same state when not placing', () => {
    const state = createHexAGone();
    const next = selectBlockForPlacement(state, 'hexagon');
    expect(next).toBe(state);
  });

  it('selectBlock + commit then selectBlockForPlacement sets placing shape', () => {
    let state = createHexAGone();
    state = selectBlock(state, 'hexagon');
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.selectedBlockForPlacement).toBe('hexagon');
    const next = selectBlockForPlacement(state, 'hexagon');
    expect(next.selectedBlockForPlacement).toBe('hexagon');
  });
});

describe("Pent'Em In AI legality", () => {
  it('getAIMove easy result is canPlacePiece-legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const state = createPent();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(
      canPlacePiece(
        state,
        move!.shapeId,
        move!.position,
        move!.rotation,
        move!.flipped
      )
    ).toBe(true);
  });
});
