/**
 * Wave 48 — Calla status hvAI thinking / You-AI win labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 48 calla — status hvAI thinking', () => {
  it('shows AI thinking class', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-ai', true);
    expect(el.querySelector('.status-ai-thinking')).not.toBeNull();
    expect(el.textContent).toMatch(/thinking/i);
  });

  it('hvAI win uses You/AI labels; scores use You/AI', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      winner: 'player1',
      phase: 'gameOver',
      player1Calla: 18,
      player2Calla: 12,
    };
    const el = document.createElement('div');
    renderStatus(state, el, 'human-vs-ai', false);
    expect(el.textContent).toMatch(/You Wins|You/);
    expect(el.querySelector('.calla-score-p1')!.textContent).toMatch(/You/);
    expect(el.querySelector('.calla-score-p2')!.textContent).toMatch(/AI/);
  });

  it('human-vs-human win uses Blue/Red', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      winner: 'player2',
      phase: 'gameOver',
    };
    const el = document.createElement('div');
    renderStatus(state, el, 'human-vs-human', false);
    expect(el.textContent).toMatch(/Red Wins/);
  });

  it('tie message', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      winner: 'tie',
      phase: 'gameOver',
    };
    const el = document.createElement('div');
    renderStatus(state, el);
    expect(el.textContent).toMatch(/Tie/);
  });
});
