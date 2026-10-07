/**
 * Deep playtest UX: You/Computer copy, ≥44px controls, AI think chrome.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createInitialState,
  getValidPlacements,
  placeCard,
  selectCard,
} from '../../src/games/stars-bars/rules';
import {
  getPlayerName,
  injectStarsStyles,
  renderScores,
  renderPlayerHand,
} from '../../src/games/stars-bars/board-ui';
import { initGame } from '../../src/games/stars-bars/game-controller';

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
  document.getElementById('stars-styles')?.remove();
});

describe('Stars & Bars deep playability UX', () => {
  it('getPlayerName uses You/Computer in vs-AI mode', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
    expect(getPlayerName('player1', true)).toBe('You');
    expect(getPlayerName('player2', true)).toBe('Computer');
  });

  it('scores and hands use You/Computer labels when vsAI', () => {
    const state = createInitialState();
    const scores = renderScores(state, { vsAI: true });
    expect(scores.textContent).toMatch(/You:/);
    expect(scores.textContent).toMatch(/Computer:/);
    expect(scores.textContent).not.toMatch(/Blue:|Red:/);

    const hand = renderPlayerHand(state, 'player1', () => undefined, {
      vsAI: true,
    });
    expect(hand.textContent).toMatch(/Your Hand/);
  });

  it('control buttons declare min-height 44px in injected CSS', () => {
    injectStarsStyles();
    const css = document.getElementById('stars-styles')?.textContent ?? '';
    expect(css).toMatch(/\.stars-btn\s*\{[^}]*min-height:\s*44px/s);
    expect(css).toMatch(/pointer:\s*coarse/);
    expect(css).toMatch(/min-height:\s*48px/);
  });

  it('shows Computer thinking + Your turn copy in vs-AI', async () => {
    vi.useFakeTimers();
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const root = document.createElement('div');
    app.appendChild(root);

    const ctrl = initGame(root, true, 'easy');
    expect(root.querySelector('.stars-status')?.textContent).toMatch(
      /Your turn/
    );
    expect(root.textContent).toMatch(/You:/);
    expect(root.textContent).toMatch(/Computer:/);

    const blueCard = ctrl.state.playerHands.player1[0]!;
    let state = selectCard(ctrl.state, blueCard.id);
    const placement = getValidPlacements(state)[0]!;
    state = placeCard(state, placement.row, placement.col);
    ctrl.state = state;
    ctrl.update();

    const thinking = root.querySelector('.stars-status');
    expect(thinking?.classList.contains('status-ai-thinking')).toBe(true);
    expect(thinking?.textContent).toMatch(/Computer is thinking/i);

    await vi.advanceTimersByTimeAsync(450);
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(root.querySelector('.stars-status')?.textContent).toMatch(
      /Your turn/
    );
  });
});
