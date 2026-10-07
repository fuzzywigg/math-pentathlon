/**
 * Fab-a-Diffy playability polish — AI-seat input lock, aria honesty,
 * 44px / reduced-motion CSS, ops without matches disabled.
 * No scoring or win-condition changes.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  newGameVsAI as fabVsAI,
  newGameVsHuman as fabVsHuman,
} from '../../src/games/fab-a-diffy/game-controller';
import {
  injectFabStyles,
  renderFractionBarPool,
  renderOperationSelector,
} from '../../src/games/fab-a-diffy/board-ui';
import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';
import * as fabAiClient from '../../src/games/fab-a-diffy/ai-client';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Fab-a-Diffy playability polish', () => {
  it('shows thinking status and disables bar selection on AI seat', () => {
    vi.useFakeTimers();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = fabVsAI(container, 'easy');
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();

    expect(container.textContent).toMatch(/Computer is thinking/i);
    expect(container.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(
      container.querySelectorAll('.fab-bar-disabled').length
    ).toBeGreaterThan(0);
    // No selectable bars while Red (computer) acts
    const selectable = [
      ...container.querySelectorAll('.fab-bar-wrapper'),
    ].filter((el) => !el.classList.contains('fab-bar-disabled'));
    expect(selectable.length).toBe(0);

    // Clicking a bar must not change phase
    const phase = ctrl.state.phase;
    container
      .querySelector('.fab-bar-wrapper')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe(phase);
  });

  it('allowInput:false omits selectable aria on bar pool', () => {
    const el = renderFractionBarPool(createFab(), () => undefined, {
      allowInput: false,
    });
    const labels = [...el.querySelectorAll('.fab-bar-wrapper')].map(
      (n) => n.getAttribute('aria-label') || ''
    );
    expect(labels.some((l) => /selectable/i.test(l))).toBe(false);
    expect(
      el.querySelector('.fab-bar-wrapper')?.getAttribute('aria-disabled')
    ).toBe('true');
  });

  it('injects reduced-motion and 44px touch floors', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')?.textContent || '';
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/min-height:\s*44px/);
    expect(css).toMatch(/pointer:\s*coarse/);
  });

  it('human vs human still wires selectable bars', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    fabVsHuman(container);
    const enabled = [
      ...container.querySelectorAll('.fab-bar-wrapper'),
    ].filter((el) => !el.classList.contains('fab-bar-disabled'));
    expect(enabled.length).toBeGreaterThan(0);
  });

  it('disables operations that have no matching answer bar', () => {
    const onSelect = vi.fn();
    let state: FabADiffyState = createFab();
    // Pick two bars; some ops will not match any answer.
    const ids = [...state.fractionBars.keys()];
    state = selectBar2(selectBar1(state, ids[0]!), ids[1]!);
    const el = renderOperationSelector(state, onSelect);
    const btns = [...el.querySelectorAll('.fab-op-btn')] as HTMLButtonElement[];
    expect(btns.length).toBe(4);

    const valid = btns.filter((b) => b.classList.contains('fab-op-valid'));
    const disabled = btns.filter((b) => b.disabled);
    // Non-matching ops must be disabled (not a confirmingMove dead-end)
    for (const btn of btns) {
      if (!btn.classList.contains('fab-op-valid')) {
        expect(btn.disabled).toBe(true);
        expect(btn.getAttribute('aria-disabled')).toBe('true');
      }
    }
    // Clicking a disabled op must not select
    for (const btn of disabled) {
      btn.click();
    }
    expect(onSelect).not.toHaveBeenCalled();
    // Valid ops remain clickable when present
    if (valid.length > 0) {
      valid[0]!.click();
      expect(onSelect).toHaveBeenCalled();
    }
  });

  it('recovers with pass when AI returns null (no soft-lock)', async () => {
    vi.useFakeTimers();
    vi.spyOn(fabAiClient, 'getAIMoveAsync').mockResolvedValue(null);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = fabVsAI(container, 'easy');
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();

    await vi.advanceTimersByTimeAsync(800);
    await Promise.resolve();
    await Promise.resolve();

    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(ctrl.state.winner).toBeNull();
    expect(container.textContent).not.toMatch(/Computer is thinking/i);
  });

  it('confirm status names the target fraction when bars resolve', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = fabVsHuman(container);
    const ids = [...ctrl.state.fractionBars.keys()];
    // 1/2 and 1/3 → add → 5/6 is a standard answer
    const half = [...ctrl.state.fractionBars.values()].find(
      (b) => b.fraction.numerator === 1 && b.fraction.denominator === 2
    );
    const third = [...ctrl.state.fractionBars.values()].find(
      (b) => b.fraction.numerator === 1 && b.fraction.denominator === 3
    );
    expect(half && third).toBeTruthy();
    ctrl.state = {
      ...ctrl.state,
      phase: 'confirmingMove',
      selectedBar1: half!.id,
      selectedBar2: third!.id,
      selectedOperation: 'add',
    };
    ctrl.update();
    expect(container.querySelector('.fab-status')?.textContent).toMatch(
      /Select matching answer \(5\/6\)/
    );
    expect(container.querySelector('.fab-answer-matchable')).toBeTruthy();
    expect(ids.length).toBeGreaterThan(0);
  });

  it('cancels stacked AI timeouts after newGame', async () => {
    vi.useFakeTimers();
    const moveSpy = vi
      .spyOn(fabAiClient, 'getAIMoveAsync')
      .mockResolvedValue(null);
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = fabVsAI(container, 'easy');
    ctrl.state = { ...ctrl.state, currentPlayer: 'player2' };
    ctrl.update();

    // Remount before the 800ms think fires
    ctrl.newGame(true, 'easy');
    moveSpy.mockClear();

    await vi.advanceTimersByTimeAsync(1200);
    await Promise.resolve();
    await Promise.resolve();

    // New game starts on player1 — scheduled AI from prior seat must not run
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(moveSpy).not.toHaveBeenCalled();
  });
});
