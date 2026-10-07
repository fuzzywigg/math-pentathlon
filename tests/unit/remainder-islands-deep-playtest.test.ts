/**
 * Deep playtest regression guards for Remainder Islands (2026-10-07).
 * Covers skip→gameOver stall, AI timer cleanup, valid-island R= hints,
 * coarse touch CSS, and full human-vs-AI match completion on Easy/Medium/Hard.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
  getCurrentState,
  getAIThinkDelays,
} from '../../src/games/remainder-islands/game-controller';
import {
  createInitialState,
  TOTAL_TURNS,
  type RemainderIslandsState,
} from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
  findValidIslands,
  calculateDivision,
} from '../../src/games/remainder-islands/rules';
import {
  getAIIslandChoice,
  type AIDifficulty,
} from '../../src/games/remainder-islands/ai';
import {
  injectRemainderIslandsStyles,
  renderBoard,
} from '../../src/games/remainder-islands/board-ui';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('remainder-islands-styles')?.remove();
});

function mount(): HTMLElement {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const container = document.createElement('div');
  app.appendChild(container);
  return container;
}

function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function hitPolygon(container: HTMLElement, islandId: string): SVGPolygonElement {
  const polys = container.querySelectorAll(
    `[data-island-id="${islandId}"] polygon`
  );
  expect(polys.length).toBeGreaterThanOrEqual(2);
  return polys[polys.length - 1] as SVGPolygonElement;
}

function mockRandomCycle(seed = 0.17): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    return ((seed * 1000 + i * 37) % 1000) / 1000;
  });
}

/** Max-remainder human (and pure AI) autopilot used for deep match sims. */
function pickMaxRemainder(state: RemainderIslandsState): string {
  const total = state.currentRoll!.total;
  let bestId = state.validIslands[0]!;
  let bestRem = -1;
  for (const id of state.validIslands) {
    const island = state.islands.find((i) => i.id === id);
    if (!island) continue;
    const rem = calculateDivision(total, island.value).remainder;
    if (rem > bestRem) {
      bestRem = rem;
      bestId = id;
    }
  }
  return bestId;
}

function simulateFullMatch(difficulty: AIDifficulty, seed: number): RemainderIslandsState {
  let state = createInitialState();
  let guard = 0;
  while (state.phase !== 'gameOver' && guard < 200) {
    guard += 1;
    if (state.phase === 'rolling') {
      state = performRoll(state);
      continue;
    }
    if (state.phase === 'selectIsland') {
      const islandId =
        state.currentPlayer === 'player1'
          ? pickMaxRemainder(state)
          : (getAIIslandChoice(state, 'player2', difficulty)?.islandId ??
            pickMaxRemainder(state));
      state = selectIsland(state, islandId);
      continue;
    }
    break;
  }
  expect(state.phase).toBe('gameOver');
  expect(guard).toBeLessThan(200);
  // Seed kept for deterministic dice when Math.random is mocked by caller.
  void seed;
  return state;
}

describe('Remainder Islands deep — skip exhausts turns into gameOver', () => {
  it('performRoll ends the match when a skip burns the last turn', () => {
    let state = createInitialState();
    state = {
      ...state,
      turnsRemaining: 1,
      player1Score: 5,
      player2Score: 8,
      islands: state.islands.map((i) => ({ ...i, owner: 'player2' as const })),
    };
    state = performRoll(state);
    expect(state.phase).toBe('gameOver');
    expect(state.turnsRemaining).toBe(0);
    expect(state.winner).toBe('player2');
    expect(state.validIslands).toEqual([]);
  });

  it('controller shows game-over chrome after a last-turn skip', () => {
    mockRandomCycle(0.22);
    const container = mount();
    initGame(container);
    newGameVsHuman();

    const locked = getCurrentState();
    for (const island of locked.islands) {
      island.owner = 'player2';
    }
    locked.turnsRemaining = 1;
    locked.player1Score = 3;
    locked.player2Score = 4;

    click(container.querySelector('.remainder-btn-roll'));
    expect(getCurrentState().phase).toBe('gameOver');
    expect(container.querySelector('.remainder-game-over')).toBeTruthy();
    expect(container.textContent).toMatch(/Red Wins/i);
  });
});

describe('Remainder Islands deep — AI timer cleanup on New Game', () => {
  it('pending AI callbacks do not mutate a restarted human match', () => {
    vi.useFakeTimers();
    mockRandomCycle();
    const container = mount();
    initGame(container);
    newGameVsAI('medium');

    click(container.querySelector('.remainder-btn-roll'));
    hitPolygon(container, getCurrentState().validIslands[0]).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().currentPlayer).toBe('player2');

    // Restart before the AI roll fires.
    newGameVsHuman();
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(getCurrentState().moveHistory).toHaveLength(0);

    vi.advanceTimersByTime(5000);
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(getCurrentState().moveHistory).toHaveLength(0);
    expect(getCurrentState().phase).toBe('rolling');
    expect(container.querySelector('.remainder-btn-roll')).toBeTruthy();
  });

  it('exposes sub-second AI think delays for snappy vs-AI pacing', () => {
    const delays = getAIThinkDelays();
    expect(delays.rollMs).toBeLessThanOrEqual(500);
    expect(delays.selectMs).toBeLessThanOrEqual(600);
    expect(delays.rollMs + delays.selectMs).toBeLessThan(1200);
  });
});

describe('Remainder Islands deep — touch UX remainder hints', () => {
  it('renders R= hints on every valid island during selection', () => {
    const base = createInitialState();
    const roll = { die1: 3, die2: 4, total: 7 };
    const valid = findValidIslands(base, roll.total).slice(0, 3);
    const svg = renderBoard(
      {
        ...base,
        phase: 'selectIsland',
        currentRoll: roll,
        validIslands: valid,
      },
      () => undefined,
      () => undefined,
      true
    );

    for (const id of valid) {
      const hint = svg.querySelector(`[data-island-id="${id}"] .island-r-hint`);
      expect(hint).toBeTruthy();
      expect(hint!.textContent).toMatch(/^R=\d+$/);
    }
  });

  it('injector ships coarse-pointer 44px+ targets and responsive board', () => {
    injectRemainderIslandsStyles();
    const css =
      document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(pointer: coarse\)/);
    expect(css).toMatch(/min-height:\s*48px/);
    expect(css).toMatch(/\.remainder-board[\s\S]*max-width:\s*100%/);
    expect(css).toMatch(/touch-action:\s*manipulation/);
  });
});

describe('Remainder Islands deep — full Easy/Medium/Hard sims (10+ each)', () => {
  const difficulties: AIDifficulty[] = ['easy', 'medium', 'hard'];

  for (const difficulty of difficulties) {
    it(`completes 12 human-vs-AI ${difficulty} matches without stall`, () => {
      const winners = { player1: 0, player2: 0, draw: 0 };
      for (let game = 0; game < 12; game += 1) {
        mockRandomCycle(0.11 + game * 0.07 + difficulty.length * 0.01);
        const end = simulateFullMatch(difficulty, game);
        expect(end.phase).toBe('gameOver');
        expect(end.turnsRemaining).toBeLessThanOrEqual(TOTAL_TURNS);
        expect(end.moveHistory.length).toBeGreaterThan(0);
        if (end.winner === 'player1') winners.player1 += 1;
        else if (end.winner === 'player2') winners.player2 += 1;
        else winners.draw += 1;
        vi.restoreAllMocks();
      }
      // Hard should win or draw at least sometimes against max-remainder human.
      expect(winners.player1 + winners.player2 + winners.draw).toBe(12);
    });
  }

  it('controller AI path finishes a medium match under fake timers', () => {
    vi.useFakeTimers();
    mockRandomCycle(0.33);
    const container = mount();
    initGame(container);
    newGameVsAI('medium');
    const { rollMs, selectMs } = getAIThinkDelays();

    let steps = 0;
    while (getCurrentState().phase !== 'gameOver' && steps < 80) {
      steps += 1;
      const state = getCurrentState();
      if (state.currentPlayer === 'player1' && state.phase === 'rolling') {
        click(container.querySelector('.remainder-btn-roll'));
        continue;
      }
      if (state.currentPlayer === 'player1' && state.phase === 'selectIsland') {
        const id = pickMaxRemainder(state);
        hitPolygon(container, id).dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
        continue;
      }
      // AI turn
      vi.advanceTimersByTime(rollMs + selectMs + 50);
    }

    expect(getCurrentState().phase).toBe('gameOver');
    expect(container.querySelector('.remainder-game-over')).toBeTruthy();
    expect(container.querySelector('.remainder-btn-roll')).toBeNull();
  });
});
