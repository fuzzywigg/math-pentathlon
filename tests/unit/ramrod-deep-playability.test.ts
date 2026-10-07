/**
 * Deep playtest playability regressions — hints, deselect, CSS floors, finishes.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getValidPlacements,
  placeRod,
  selectRod,
  hasValidMoves,
  passTurn,
} from '../../src/games/ramrod/rules';
import { injectRamrodStyles } from '../../src/games/ramrod/board-ui';
import type { AIDifficulty } from '../../src/games/ramrod/ai';

describe('Ramrod deep playability', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('ramrod-styles')?.remove();
  });

  it('shows secondary turn hint under locked select status', async () => {
    const { newGameVsAI } =
      await import('../../src/games/ramrod/game-controller');
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsAI(root, 'easy');
    expect(root.querySelector('.ramrod-status')?.textContent).toBe(
      "🔵 Blue's turn - Select a rod"
    );
    expect(root.querySelector('.ramrod-turn-hint')?.textContent).toMatch(
      /Your hand \(Blue\)/
    );
  });

  it('shows place hint and tap-selected rod clears selection', async () => {
    const { newGameVsAI } =
      await import('../../src/games/ramrod/game-controller');
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'medium');
    const rodId = ctrl.state.playerRods.player1[0]!;
    ctrl.state = selectRod(ctrl.state, rodId);
    ctrl.update();
    expect(root.querySelector('.ramrod-status')?.textContent).toBe(
      '🔵 Blue - Place rod in a valid box'
    );
    expect(root.querySelector('.ramrod-turn-hint')?.textContent).toBeTruthy();

    const selected = root.querySelector('.ramrod-rod-wrapper.selected.selectable');
    expect(selected).toBeTruthy();
    selected?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('selectingRod');
    expect(ctrl.state.selectedRod).toBeNull();
  });

  it('injected CSS includes 44px coarse touch floors and stacked layout', () => {
    injectRamrodStyles();
    const css = document.getElementById('ramrod-styles')?.textContent ?? '';
    expect(css).toMatch(/pointer:\s*coarse/);
    expect(css).toMatch(/min-height:\s*44px/);
    expect(css).toMatch(/ramrod-turn-hint/);
    expect(css).toMatch(/prefers-reduced-motion/);
    expect(css).toMatch(/flex-direction:\s*column/);
    expect(css).toMatch(/max-width:\s*100%/);
  });

  it.each(['easy', 'medium', 'hard'] as AIDifficulty[])(
    'scripted greedy human finishes or deadlocks cleanly vs AI %s (×4)',
    async (difficulty) => {
      const { newGameVsAI } =
        await import('../../src/games/ramrod/game-controller');

      for (let g = 0; g < 4; g++) {
        const root = document.createElement('div');
        document.body.appendChild(root);
        const ctrl = newGameVsAI(root, difficulty);
        let guard = 0;
        let deadlocked = false;
        while (ctrl.state.phase !== 'gameOver' && guard++ < 200) {
          if (ctrl.state.currentPlayer === 'player2') {
            await vi.advanceTimersByTimeAsync(550);
            continue;
          }
          if (!hasValidMoves(ctrl.state)) {
            // Mutual inability is a rules residual — hint + stop (no score change)
            if (root.querySelector('.ramrod-deadlock-hint')) {
              deadlocked = true;
              break;
            }
            ctrl.state = passTurn(ctrl.state);
            ctrl.update();
            if (root.querySelector('.ramrod-deadlock-hint')) {
              deadlocked = true;
              break;
            }
            continue;
          }
          const rods = [...ctrl.state.playerRods.player1];
          let placed = false;
          for (const rodId of rods) {
            const next = selectRod(ctrl.state, rodId);
            const spots = getValidPlacements(next, rodId);
            if (spots.length === 0) continue;
            ctrl.state = placeRod(next, spots[0]!.boxId, spots[0]!.slot);
            ctrl.update();
            placed = true;
            break;
          }
          if (!placed) {
            ctrl.state = passTurn(ctrl.state);
            ctrl.update();
          }
        }
        expect(
          ctrl.state.phase === 'gameOver' || deadlocked,
          `game ${g} ended without winner or deadlock hint`
        ).toBe(true);
        root.remove();
        document.getElementById('ramrod-styles')?.remove();
      }
    }
  );
});
