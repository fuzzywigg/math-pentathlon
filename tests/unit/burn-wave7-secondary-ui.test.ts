import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { renderStatus as renderHexStatus } from '../../src/games/hex/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderStatus as renderCallaStatus } from '../../src/games/calla/board-ui';

import {
  createInitialState as createContig,
  getValidPlacements,
} from '../../src/games/contig-60/types';
import {
  renderExpressionSelector,
  getPlayerName as contigName,
} from '../../src/games/contig-60/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { renderMoveHistory as renderParHistory } from '../../src/games/par-55/board-ui';
import { AttributeBlock } from '../../src/games/par-55/types';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import { renderMoveHistory as renderStarsHistory } from '../../src/games/stars-bars/board-ui';
import { AttributeCard } from '../../src/games/stars-bars/types';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory as renderKwaHistory } from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  renderMoveHistory as renderFabHistory,
  getPlayerName as fabName,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import { renderGameOver as renderFracGameOver } from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { renderGameOver as renderPinballGameOver } from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import { renderGameOver as renderRemainderGameOver } from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import {
  renderShapeControls,
  getPlayerName as juggleName,
} from '../../src/games/juggle/board-ui';

import { getPlayerName as sdName } from '../../src/games/sum-dominoes/board-ui';
import { getPlayerName as pentName } from '../../src/games/pent-em-in/board-ui';
import { getPlayerName as qgName } from '../../src/games/queens-guards/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Burn wave 7 — Star Track renderStatus', () => {
  it('mounts turn chrome and progress bars on a fresh draw phase', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderStarStatus(createStar(), container);
    expect(container.querySelector('.star-track-status')).toBeTruthy();
    expect(container.querySelector('.status-turn')?.textContent).toMatch(
      /Draw|Blue|turn/i
    );
    expect(container.querySelector('.progress-p1')).toBeTruthy();
    expect(container.querySelector('.progress-p2')).toBeTruthy();
  });

  it('shows winner chrome with You/AI labels in human-vs-ai mode', () => {
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
      'human-vs-ai'
    );
    expect(container.querySelector('.status-winner')).toBeTruthy();
    expect(container.textContent).toMatch(/You|Wins/i);
  });

  it('shows draw text without status-winner when winner is null', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderStarStatus(
      {
        ...createStar(),
        phase: 'gameOver',
        winner: null,
      },
      container
    );
    expect(container.querySelector('.status-winner')).toBeNull();
    expect(container.textContent).toMatch(/draw/i);
  });

  it('marks AI thinking state', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderStarStatus(createStar(), container, 'human-vs-ai', true);
    expect(container.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(container.textContent).toMatch(/thinking/i);
  });
});

describe('Burn wave 7 — Hex / Calla winner + tie status', () => {
  it('Hex renderStatus shows winner and AI thinking', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexStatus(
      { ...createHex(5), winner: 'player2' },
      container,
      'human-vs-human'
    );
    expect(container.querySelector('.status-winner')).toBeTruthy();
    expect(container.textContent).toMatch(/Red|Wins/i);

    renderHexStatus(createHex(5), container, 'human-vs-ai', true);
    expect(container.querySelector('.status-ai-thinking')).toBeTruthy();
  });

  it('Calla renderStatus shows tie and You win labels', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderCallaStatus(
      { ...createCalla(), winner: 'tie' },
      container,
      'human-vs-human'
    );
    expect(container.querySelector('.status-winner')).toBeTruthy();
    expect(container.textContent).toMatch(/Tie/i);

    renderCallaStatus(
      { ...createCalla(), winner: 'player1' },
      container,
      'human-vs-ai'
    );
    expect(container.textContent).toMatch(/You|Wins/i);
  });
});

describe('Burn wave 7 — Contig expression selector', () => {
  it('lists expression options when placements exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = {
      ...createContig(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    const placements = getValidPlacements(state, state.currentDice!);
    expect(placements.length).toBeGreaterThan(0);

    let selected: { value: number; expression: string } | null = null;
    const el = renderExpressionSelector(
      state,
      (value, expression) => {
        selected = { value, expression };
      },
      () => undefined
    );
    document.body.appendChild(el);
    expect(el.querySelectorAll('.contig-expr-option').length).toBe(
      placements.length
    );
    (el.querySelector('.contig-expr-option') as HTMLButtonElement).click();
    expect(selected).not.toBeNull();
    expect(contigName('player1').length).toBeGreaterThan(0);
  });

  it('shows pass button when no placements remain', () => {
    const base = createContig();
    const cells = new Map(base.cells);
    for (const [id, cell] of cells) {
      cells.set(id, { ...cell, owner: 'player2' });
    }
    const state = {
      ...base,
      cells,
      phase: 'calculating' as const,
      currentDice: [1, 1, 1] as [number, number, number],
    };
    let passed = false;
    const el = renderExpressionSelector(
      state,
      () => undefined,
      () => {
        passed = true;
      }
    );
    document.body.appendChild(el);
    expect(el.querySelector('.contig-pass-btn')).toBeTruthy();
    (el.querySelector('.contig-pass-btn') as HTMLButtonElement).click();
    expect(passed).toBe(true);
  });
});

describe('Burn wave 7 — non-empty move histories', () => {
  it('Par history lists injected moves', () => {
    const block: AttributeBlock = {
      id: 'b1',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    const state = {
      ...createPar(),
      moveHistory: [
        {
          player: 'player1' as const,
          block,
          baseId: 'base-0-0',
          pointsScored: 4,
          matchDetails: [],
          moveNumber: 1,
        },
      ],
    };
    const el = renderParHistory(state);
    document.body.appendChild(el);
    expect(el.querySelectorAll('.par55-history-move').length).toBe(1);
    expect(el.textContent).toMatch(/Blue|circle|red|\+4/i);
  });

  it('Stars history lists injected moves', () => {
    const card: AttributeCard = {
      id: 'c1',
      shape: 'square',
      color: 'blue',
      size: 'large',
      thickness: 'thick',
    };
    const state = {
      ...createStars(),
      moveHistory: [
        {
          player: 'player2' as const,
          card,
          row: 1,
          col: 2,
          score: 3,
          breakdown: '1 attr',
        },
      ],
    };
    const el = renderStarsHistory(state);
    document.body.appendChild(el);
    expect(el.querySelectorAll('.stars-move-item').length).toBe(1);
    expect(el.textContent).toMatch(/square|\+3/i);
  });

  it('Kwatro history lists injected moves', () => {
    const state = createKwa();
    const chip = [...state.chips.values()][0];
    const el = renderKwaHistory({
      ...state,
      moveHistory: [
        {
          player: 'player1',
          chip,
          fromNode: 'n1',
          toNode: 'n2',
          alignment: null,
          moveNumber: 1,
        },
      ],
    });
    document.body.appendChild(el);
    expect(el.querySelectorAll('.kwa-history-move').length).toBe(1);
    expect(el.textContent).toMatch(/Blue/);
  });

  it('Fab history lists a completed claim', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createFab();
    const bar1Id = [...state.fractionBars.keys()][0];
    const bar2Id = [...state.fractionBars.keys()][1];
    const answerId = [...state.answerBars.keys()][0];
    const el = renderFabHistory({
      ...state,
      moveHistory: [
        {
          player: 'player1',
          bar1Id,
          bar2Id,
          operation: 'add',
          resultId: answerId,
          moveNumber: 1,
        },
      ],
    });
    document.body.appendChild(el);
    expect(el.querySelectorAll('.fab-history-move').length).toBe(1);
    expect(fabName('player2').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 7 — quiz gameOver tie branches', () => {
  it('Frac / Pinball / Remainder render Draw text when winner is null', () => {
    const frac = renderFracGameOver({
      ...createFrac(),
      phase: 'gameOver',
      winner: null,
    });
    expect(frac.textContent).toMatch(/Draw/i);
    expect(frac.textContent).not.toMatch(/Blue Wins/i);

    const pinball = renderPinballGameOver({
      ...createPinball(),
      phase: 'gameOver',
      winner: null,
    });
    expect(pinball.textContent).toMatch(/Draw/i);

    const remainder = renderRemainderGameOver({
      ...createRemainder(),
      phase: 'gameOver',
      winner: null,
    });
    expect(remainder.textContent).toMatch(/Draw/i);
  });
});

describe('Burn wave 7 — player name helpers', () => {
  it('exports non-empty display names across games', () => {
    expect(juggleName('player1').length).toBeGreaterThan(0);
    expect(sdName('player2').length).toBeGreaterThan(0);
    expect(pentName('player1').length).toBeGreaterThan(0);
    expect(qgName('player2').length).toBeGreaterThan(0);
    expect(contigName('player1').length).toBeGreaterThan(0);
    expect(fabName('player2').length).toBeGreaterThan(0);
  });

  it('renderShapeControls returns empty shell without a selected shape', () => {
    const el = renderShapeControls(
      createJuggle(),
      () => undefined,
      () => undefined
    );
    expect(el.classList.contains('juggle-shape-controls')).toBe(true);
    expect(el.querySelector('.juggle-control-btn')).toBeNull();
  });
});
