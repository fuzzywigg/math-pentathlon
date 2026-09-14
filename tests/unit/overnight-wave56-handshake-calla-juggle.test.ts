/**
 * Wave 56 leftover after #256 — Handshake calla × juggle residual chrome.
 * Slice-only (no ramrod); distinct from wave52/55 three-engine mounts. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { renderBoard as renderCalla, renderStatus } from '../../src/games/calla/board-ui';
import { callaTutorial } from '../../src/games/calla/tutorial';
import {
  createInitialState as juggleInit,
  selectDie,
} from '../../src/games/juggle/rules';
import {
  injectJuggleStyles,
  renderBoard as renderJuggle,
  renderDice,
  getPlayerName,
} from '../../src/games/juggle/board-ui';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 56 handshake — calla × juggle', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
  });

  it('mounts calla + juggle leftover chrome with unique tutorial ids', () => {
    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')?.textContent).toMatch(/28px/);

    const callaBox = document.createElement('div');
    const callaStatus = document.createElement('div');
    renderCalla(callaInit(), callaBox);
    renderStatus(callaInit(), callaStatus);
    expect(callaBox.querySelector('.calla-board-bg')?.getAttribute('rx')).toBe('20');
    expect(callaStatus.querySelector('.calla-scores')).toBeTruthy();

    const j = selectDie(
      { ...juggleInit(), phase: 'selectingShape', currentDice: [1, 1] },
      0
    );
    expect(
      renderJuggle(
        j.boards.player1,
        'player1',
        true,
        j,
        () => undefined,
        () => undefined,
        () => undefined
      ).classList.contains('active')
    ).toBe(true);
    expect(renderDice([1, 2], () => undefined, () => undefined, false, 'placing').textContent).toMatch(
      /⚀/
    );
    expect(getPlayerName('player2')).toBe('Red');

    expect(callaTutorial.id).not.toBe(juggleTutorial.id);
    expect(callaTutorial.steps.length).toBe(10);
    expect(juggleTutorial.steps.length).toBe(7);
  });
});
