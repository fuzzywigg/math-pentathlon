/**
 * Prime Gold — AI-seat input lock (UI/board only).
 * Human must not see Roll / Pass / valid-cell / expression chrome while Red thinks,
 * and taps during the think pause must not change state.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeChip,
  rollDice,
} from '../../src/games/prime-gold/rules';
import {
  injectPrimeGoldStyles,
  renderBoard,
  renderDice,
  renderExpressions,
} from '../../src/games/prime-gold/board-ui';

describe('Prime Gold AI-turn input guard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('prime-gold-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('prime-gold-styles')?.remove();
    const { destroyGame } = await import(
      '../../src/games/prime-gold/game-controller'
    );
    destroyGame();
    vi.restoreAllMocks();
  });

  it('renderBoard with allowInput false does not mark valid placements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(createInitialState());
    expect(state.phase).toBe('placing');
    expect(getValidPlacements(state).length).toBeGreaterThan(0);

    const el = renderBoard(state, () => undefined, { allowInput: false });
    expect(el.querySelectorAll('.pg-cell.valid')).toHaveLength(0);
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
  });

  it('renderDice with allowInput false hides Roll on rolling phase', () => {
    const onRoll = vi.fn();
    const el = renderDice(createInitialState(), onRoll, { allowInput: false });
    expect(el.querySelector('.pg-roll-btn')).toBeNull();
    expect(onRoll).not.toHaveBeenCalled();
  });

  it('renderExpressions with allowInput false skips selectable items', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = rollDice(createInitialState());
    const onSelect = vi.fn();
    const el = renderExpressions(state, onSelect, { allowInput: false });
    expect(el.querySelectorAll('.pg-expr-item')).toHaveLength(0);
    expect(el.querySelector('.pg-computer-thinking')).toBeTruthy();
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('blocks board/expression taps during the 800ms AI pause', async () => {
    const { newGameVsAI } = await import(
      '../../src/games/prime-gold/game-controller'
    );

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'easy');

    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = rollDice(ctrl.state);
    const placement = getValidPlacements(state)[0]!;
    state = placeChip(state, placement.value, placement.expr);
    ctrl.state = state;
    ctrl.update();

    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.phase).toBe('rolling');
    expect(ctrl.state.moveHistory).toHaveLength(1);
    expect(root.querySelector('.pg-roll-btn')).toBeNull();
    expect(root.querySelectorAll('.pg-cell.valid')).toHaveLength(0);
    expect(root.querySelector('.pg-expr-item')).toBeNull();
    expect(root.querySelector('.pg-status')?.textContent).toMatch(
      /Computer is thinking/
    );
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();

    // Stale human chrome must not advance the AI seat if somehow clicked.
    root
      .querySelector('.pg-cell')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(1);
    expect(ctrl.state.phase).toBe('rolling');

    await vi.advanceTimersByTimeAsync(800);
    // AI rolls then places on a shorter follow-up delay
    await vi.advanceTimersByTimeAsync(600);

    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(ctrl.state.moveHistory[1]?.player).toBe('player2');
  });

  it('injector ships coarse-pointer 44px targets and reduced-motion overrides', () => {
    injectPrimeGoldStyles();
    const css = document.getElementById('prime-gold-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(pointer:\s*coarse\)/);
    expect(css).toMatch(/min-height:\s*44px/);
    expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)/);
    expect(css).toMatch(/\.pg-cell\.valid:hover[\s\S]*transform:\s*none/);
    expect(css).toMatch(/\.pg-die\.rolling[\s\S]*animation:\s*none/);
  });
});
