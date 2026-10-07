/**
 * Deep playtest regressions for Sum Dominoes (2026-10-07):
 * AI timer seat guard, multi-game Easy/Med/Hard finishes, deselect escape,
 * turn hints, and coarse/tablet touch CSS floors.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
} from '../../src/games/sum-dominoes/game-controller';
import {
  executeAITurn,
  getAIMove,
  type AIDifficulty,
} from '../../src/games/sum-dominoes/ai';
import {
  createInitialState,
  selectDomino,
  placeDomino,
  passTurn,
  doRollDice,
  getValidPlacements,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

function mount(): HTMLElement {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const container = document.createElement('div');
  app.appendChild(container);
  return container;
}

/** Drive a full human+AI game with a greedy human until gameOver or budget. */
function playScriptedVsAI(
  difficulty: AIDifficulty,
  maxPlies = 200
): { winner: string | null; plies: number; phase: string } {
  let state = createInitialState();
  const ai = 'player2' as const;

  for (let plies = 0; plies < maxPlies; plies++) {
    if (state.winner || state.phase === 'gameOver') {
      return { winner: state.winner, plies, phase: state.phase };
    }

    if (state.currentPlayer === ai) {
      state = executeAITurn(state, ai, difficulty);
      continue;
    }

    if (state.phase === 'rolling') {
      state = doRollDice(state);
      continue;
    }
    if (state.phase === 'passing') {
      state = passTurn(state);
      continue;
    }
    if (state.phase === 'placing' && state.currentDice) {
      const sum = getDiceSum(state.currentDice);
      const hand = state.hands.player1;
      let played = false;
      for (const d of hand) {
        const spots = getValidPlacements(state, d, sum);
        if (spots.length === 0) continue;
        state = selectDomino(state, d.id);
        state = placeDomino(state, spots[0].position, spots[0].orientation);
        played = true;
        break;
      }
      if (!played) {
        state = passTurn({ ...state, phase: 'passing' });
      }
    }
  }

  return {
    winner: state.winner,
    plies: maxPlies,
    phase: state.phase,
  };
}

describe('Sum Dominoes deep — AI multi-game finish', () => {
  it.each(['easy', 'medium', 'hard'] as AIDifficulty[])(
    '%s: 12 scripted human-vs-AI games all reach gameOver',
    (difficulty) => {
      const outcomes: string[] = [];
      for (let g = 0; g < 12; g++) {
        const result = playScriptedVsAI(difficulty);
        expect(result.phase).toBe('gameOver');
        expect(result.plies).toBeLessThan(200);
        outcomes.push(result.winner ?? 'draw');
      }
      expect(outcomes.length).toBe(12);
    }
  );
});

describe('Sum Dominoes deep — controller AI seat guard', () => {
  it('clears stacked timers so Blue still must roll after Red', () => {
    vi.useFakeTimers();
    const container = mount();
    const ctrl = initGame(container, true, 'hard');
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      winner: null,
    };
    ctrl.update();

    for (let i = 0; i < 10; i++) {
      vi.advanceTimersByTime(800);
      if (ctrl.state.currentPlayer === 'player1' || ctrl.state.winner) break;
    }

    if (!ctrl.state.winner) {
      expect(ctrl.state.currentPlayer).toBe('player1');
      expect(ctrl.state.phase).toBe('rolling');
      expect(ctrl.state.currentDice).toBeNull();
      vi.advanceTimersByTime(5000);
      expect(ctrl.state.currentDice).toBeNull();
      expect(container.querySelector('.sd-roll-btn')).toBeTruthy();
      expect(container.querySelector('.sd-turn-hint')).toBeNull();
    }
  });

  it('shows turn hint while human is placing or must pass', () => {
    const container = mount();
    const ctrl = newGameVsAI(container, 'easy');
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player1',
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: null,
      winner: null,
    };
    ctrl.update();
    expect(container.querySelector('.sd-turn-hint')?.textContent).toMatch(
      /Highlighted dominoes/i
    );

    ctrl.state = {
      ...ctrl.state,
      phase: 'passing',
      currentDice: [1, 1],
    };
    ctrl.update();
    expect(container.querySelector('.sd-turn-hint')?.textContent).toMatch(
      /Pass Turn/i
    );
    expect(container.querySelector('.sd-pass-btn')).toBeTruthy();
  });
});

describe('Sum Dominoes deep — deselect + touch CSS', () => {
  it('tapping the selected domino clears selection', () => {
    const base = createInitialState();
    const seed = base.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL]!;
    const tile = {
      id: 'toggle-me',
      face1: seed.domino.face1,
      face2: 1,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    let state = {
      ...base,
      phase: 'placing' as const,
      currentDice: [seed.domino.face1, 1] as [number, number],
      selectedDomino: null as string | null,
      hands: { ...base.hands, player1: [tile] },
      currentPlayer: 'player1' as const,
    };
    state = selectDomino(state, 'toggle-me');
    expect(state.selectedDomino).toBe('toggle-me');
    state = selectDomino(state, 'toggle-me');
    expect(state.selectedDomino).toBeNull();
  });

  it('injected CSS enforces 44px floors for roll/pass/hand/cells on coarse', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-roll-btn,\s*\.sd-pass-btn\s*\{[^}]*min-height:\s*44px/s
    );
    expect(css).toMatch(/min-height:\s*44px/);
    expect(css).toMatch(/@media \(pointer: coarse\), \(max-width: 900px\)/);
    expect(css).toMatch(/\.sd-cell\s*\{[^}]*min-height:\s*44px/s);
    expect(css).toMatch(/\.sd-turn-hint/);
  });
});

describe('Sum Dominoes deep — AI move null stall guard', () => {
  it('getAIMove null with empty hand does not throw; executeAITurn returns', () => {
    const state = createInitialState();
    const stuck = {
      ...state,
      currentPlayer: 'player2' as const,
      phase: 'placing' as const,
      currentDice: [2, 2] as [number, number],
      hands: { ...state.hands, player2: [] },
    };
    expect(getAIMove(stuck, 'player2', 'hard')).toBeNull();
    const next = executeAITurn(stuck, 'player2', 'hard');
    expect(next).toBeTruthy();
  });
});
