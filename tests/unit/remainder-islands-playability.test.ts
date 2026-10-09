/**
 * Playability guards for Remainder Islands (#373 hover-eats-click, #374 AI-turn input).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/remainder-islands/game-controller';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';
import { mountAppShell } from './helpers/dom';

import { click } from '../helpers/dom-click';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('remainder-islands-styles')?.remove();
});

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

describe('Remainder Islands playability — hover must not swallow click (#373)', () => {
  it('mouseenter keeps the hit polygon in the DOM so click can claim the island', () => {
    mockRandomCycle();
    const container = mountAppShell();
    initGame(container);
    newGameVsHuman();

    click(container.querySelector('.remainder-btn-roll'));
    expect(getCurrentState().phase).toBe('selectIsland');
    const islandId = getCurrentState().validIslands[0];
    expect(islandId).toBeTruthy();

    const hit = hitPolygon(container, islandId);
    const boardBefore = container.querySelector('.remainder-board');
    hit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(container.contains(hit)).toBe(true);
    expect(container.querySelector('.remainder-board')).toBe(boardBefore);
    expect(getCurrentState().selectedIsland).toBe(islandId);
    expect(container.querySelector('.remainder-preview .divisor')).toBeTruthy();

    hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().phase).toBe('rolling');
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().moveHistory[0]?.island.id).toBe(islandId);
  });

  it('primary pointer tap (down+up) on a valid hit area claims the island', () => {
    mockRandomCycle(0.41);
    const container = mountAppShell();
    initGame(container);
    newGameVsHuman();

    click(container.querySelector('.remainder-btn-roll'));
    const islandId = getCurrentState().validIslands[0];
    const hit = hitPolygon(container, islandId);
    const init: PointerEventInit = {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
      clientX: 10,
      clientY: 10,
    };
    hit.dispatchEvent(new PointerEvent('pointerdown', { ...init, buttons: 1 }));
    hit.dispatchEvent(new PointerEvent('pointerup', { ...init, buttons: 0 }));

    expect(getCurrentState().phase).toBe('rolling');
    expect(getCurrentState().moveHistory[0]?.island.id).toBe(islandId);
  });
});

describe('Remainder Islands playability — no human input on AI turn (#374)', () => {
  it('hides the roll button and ignores island activation while Red (computer) is to move', () => {
    vi.useFakeTimers();
    mockRandomCycle();

    const container = mountAppShell();
    initGame(container);
    newGameVsAI('easy');

    click(container.querySelector('.remainder-btn-roll'));
    const p1Island = getCurrentState().validIslands[0];
    hitPolygon(container, p1Island).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );

    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');
    expect(container.querySelector('.remainder-btn-roll')).toBeNull();
    expect(container.textContent).toMatch(/computer/i);

    const p1Score = getCurrentState().player1Score;
    const p2Score = getCurrentState().player2Score;
    const historyLen = getCurrentState().moveHistory.length;

    vi.advanceTimersByTime(800);
    if (getCurrentState().phase === 'selectIsland') {
      expect(getCurrentState().currentPlayer).toBe('player2');
      expect(container.querySelector('.remainder-btn-roll')).toBeNull();
      const aiIsland = getCurrentState().validIslands[0];
      const group = container.querySelector(`[data-island-id="${aiIsland}"]`);
      expect(group).toBeTruthy();
      const polys = group!.querySelectorAll('polygon');
      expect(polys.length).toBe(1);

      group!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
      expect(getCurrentState().currentPlayer).toBe('player2');
      expect(getCurrentState().moveHistory.length).toBe(historyLen);
      expect(getCurrentState().player2Score).toBe(p2Score);
    }

    expect(getCurrentState().player1Score).toBe(p1Score);
  });

  it('renderBoard(interactive=false) does not bind click or hover', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const onClick = vi.fn();
    const onHover = vi.fn();
    const svg = renderBoard(
      {
        ...base,
        phase: 'selectIsland',
        currentRoll: { die1: 2, die2: 2, total: 4 },
        validIslands: [island.id],
      },
      onClick,
      onHover,
      false
    );
    const polys = svg.querySelectorAll(`[data-island-id="${island.id}"] polygon`);
    expect(polys.length).toBe(1);
    const hex = polys[0] as SVGPolygonElement;
    hex.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    hex.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
    expect(onHover).not.toHaveBeenCalled();
  });
});
