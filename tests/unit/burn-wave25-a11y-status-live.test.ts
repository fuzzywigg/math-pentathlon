/**
 * Wave 25 — board-a11y markStatusLive + game status remount contracts.
 * Distinct from wave 19 status-ui copy edges and #131 inventory.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { markStatusLive } from '../../src/ui/board-a11y';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import { renderStatus as renderHagStatus } from '../../src/games/hex-a-gone/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderStatus as renderCallaStatus } from '../../src/games/calla/board-ui';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus as renderKingsStatus } from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import { startGame as startFrac } from '../../src/games/frac-fact/rules';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { startGame as startPinball } from '../../src/games/fraction-pinball/rules';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import { createInitialState as createJuggle } from '../../src/games/juggle/rules';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 25 a11y-status-live — markStatusLive helper', () => {
  it('sets role=status and aria-live=polite', () => {
    const el = document.createElement('div');
    markStatusLive(el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('overwrites prior live region attrs', () => {
    const el = document.createElement('div');
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    markStatusLive(el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('is idempotent across remounts of the same node', () => {
    const el = document.createElement('div');
    markStatusLive(el);
    markStatusLive(el);
    markStatusLive(el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('works on status roots that already have children', () => {
    const el = document.createElement('div');
    el.innerHTML = '<span class="turn">Blue to move</span>';
    markStatusLive(el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.querySelector('.turn')?.textContent).toBe('Blue to move');
  });
});

describe('Wave 25 a11y-status-live — Star / Hag / Calla / Kings status roots', () => {
  it('Star Track renderStatus marks polite live region on status child', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const el = document.createElement('div');
    document.body.appendChild(el);
    const state = drawChains(createStar());
    renderStarStatus(state, el);
    // Star Track marks the inner .star-track-status, not the container
    const live = el.querySelector(
      '.star-track-status[role="status"][aria-live="polite"]'
    );
    expect(live).toBeTruthy();
    expect(el.textContent).toMatch(/chain|choose|select/i);
  });

  it('Star Track remount keeps live attrs after gameOver', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStarStatus(createStar(), el);
    const over = {
      ...createStar(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    renderStarStatus(over, el);
    const live = el.querySelector(
      '.star-track-status[role="status"][aria-live="polite"]'
    );
    expect(live).toBeTruthy();
    expect(el.textContent).toMatch(/win|Blue|Player/i);
  });

  it('Hex-a-Gone renderStatus is a live region through phase changes', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderHagStatus(createHag(), el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');

    const over = {
      ...createHag(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    renderHagStatus(over, el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('Calla status remount preserves polite live region', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderCallaStatus(createCalla(), el, 'human-vs-human', false);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');

    renderCallaStatus(
      { ...createCalla(), winner: 'tie' },
      el,
      'human-vs-ai',
      true
    );
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('Kings renderStatus marks live through AI thinking remount', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderKingsStatus(createKings(), el, 'human-vs-ai', 'hard', false);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');

    renderKingsStatus(createKings(), el, 'human-vs-ai', 'easy', true);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.textContent).toMatch(/thinking/i);
  });
});

describe('Wave 25 a11y-status-live — controller-style status containers', () => {
  it('Frac Fact / Pinball opening states exist for live status wiring', () => {
    const frac = startFrac(createFrac('easy'));
    expect(frac.currentProblem).not.toBeNull();
    const pinball = startPinball(createPinball('medium'));
    expect(pinball.currentChallenge).not.toBeNull();
  });

  it('quiz/board status containers accept markStatusLive and keep attrs', () => {
    for (const label of ['frac', 'pinball', 'prime', 'sum', 'contig']) {
      const status = document.createElement('div');
      status.id = `${label}-status`;
      status.textContent = `${label} turn`;
      markStatusLive(status);
      document.body.appendChild(status);
      expect(status.getAttribute('role')).toBe('status');
      expect(status.getAttribute('aria-live')).toBe('polite');
    }
  });

  it('opening states exist for games that wire markStatusLive in controllers', () => {
    expect(createPrime().phase).toBeTruthy();
    expect(createSum().phase).toBeTruthy();
    expect(createContig().phase).toBeTruthy();
    expect(createPent().phase).toBeTruthy();
    expect(createQueens().currentPlayer).toBeTruthy();
    expect(createRemainder().phase).toBeTruthy();
    expect(createJuggle().phase).toBeTruthy();
  });

  it('replacing status innerHTML keeps live attrs on the root', () => {
    const status = document.createElement('div');
    markStatusLive(status);
    document.body.appendChild(status);
    status.innerHTML = '<p>Blue to move</p>';
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    status.innerHTML = '<p>Red wins!</p>';
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toMatch(/Red wins/);
  });

  it('multiple status roots on a page stay independently live', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    markStatusLive(a);
    markStatusLive(b);
    document.body.append(a, b);
    a.textContent = 'board A';
    b.textContent = 'board B';
    expect(
      document.querySelectorAll('[role="status"][aria-live="polite"]').length
    ).toBe(2);
  });
});
