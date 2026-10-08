/**
 * Salvaged from #419 (compliant slice only).
 * Pins tip touch remainder hints + coarse CSS; does NOT assert AI retunes,
 * skip→gameOver rules changes, AI timing retunes, or instruction copy changes.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/remainder-islands/game-controller';
import {
  injectRemainderIslandsStyles,
  renderBoard,
} from '../../src/games/remainder-islands/board-ui';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { calculateDivision } from '../../src/games/remainder-islands/rules';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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

function mockRandomCycle(seed = 0.17): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    return ((seed * 1000 + i * 37) % 1000) / 1000;
  });
}

describe('Remainder Islands salvage — touch R= hints (#419 compliant)', () => {
  it('renders R= hints on every valid island during selection (no hover needed)', () => {
    const base = createInitialState();
    const roll = { die1: 4, die2: 3, total: 7 };
    const validIslands = base.islands.slice(0, 3).map((i) => i.id);
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: roll,
      selectedIsland: null,
      validIslands,
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    for (const id of validIslands) {
      const hint = svg.querySelector(`[data-island-id="${id}"] .island-r-hint`);
      expect(hint).toBeTruthy();
      const island = base.islands.find((i) => i.id === id)!;
      const rem = calculateDivision(7, island.value).remainder;
      expect(hint!.textContent).toBe(`R=${rem}`);
    }
  });

  it('hides static hints while the selected island-r-preview is shown', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const roll = { die1: 4, die2: 3, total: 7 };
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: roll,
      selectedIsland: island.id,
      validIslands: [island.id],
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const group = svg.querySelector(`[data-island-id="${island.id}"]`);
    expect(group?.querySelector('.island-r-preview')).toBeTruthy();
    const hint = group?.querySelector('.island-r-hint');
    // Hint may be absent (selected path skips creating it) or hidden.
    if (hint) {
      expect(hint.getAttribute('visibility')).toBe('hidden');
    }
  });

  it('injector ships coarse-pointer 44px+ targets and touch-action', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')!.textContent!;
    expect(css).toMatch(/touch-action:\s*manipulation/);
    expect(css).toMatch(/@media \(pointer:\s*coarse\)/);
    expect(css).toMatch(/min-height:\s*48px/);
    expect(css).toMatch(/\.island-r-hint/);
  });

  it('does not mount an empty division preview before an island is selected', () => {
    mockRandomCycle();
    const container = mount();
    initGame(container);
    newGameVsHuman();
    const rollBtn = container.querySelector('.remainder-btn-roll');
    expect(rollBtn).toBeTruthy();
    rollBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().phase).toBe('selectIsland');
    expect(getCurrentState().selectedIsland).toBeNull();
    expect(container.querySelector('.remainder-preview')).toBeNull();
  });

  it('tip AI think delays remain 800ms (no #419 timing retune)', () => {
    const src = readFileSync(
      join(import.meta.dirname, '../../src/games/remainder-islands/game-controller.ts'),
      'utf8'
    );
    expect(src).toMatch(/scheduleAI\(aiRoll,\s*800\)/);
    expect(src).toMatch(/scheduleAI\(aiSelectIsland,\s*800\)/);
    expect(src).not.toMatch(/AI_ROLL_DELAY_MS\s*=\s*450/);
  });
});
