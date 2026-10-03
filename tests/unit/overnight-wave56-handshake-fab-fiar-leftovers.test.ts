/**
 * Wave 56 leftover after #255/#256 — fab × fiar objective + layout handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { newGameVsHuman as fabHuman } from '../../src/games/fab-a-diffy/game-controller';
import { initGame as initFiar } from '../../src/games/fiar/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 56 handshake — fab × fiar leftovers', () => {
  it('objective ids distinct; layout + status live chrome mounts', () => {
    expect(fabADiffyTutorial.steps.some((s) => s.id === 'objective')).toBe(
      true
    );
    expect(fiarTutorial.steps.some((s) => s.id === 'objective')).toBe(true);
    expect(fabADiffyTutorial.id).not.toBe(fiarTutorial.id);

    const fabBox = document.createElement('div');
    document.body.appendChild(fabBox);
    fabHuman(fabBox);
    expect(fabBox.querySelector('.fab-left-column')).toBeTruthy();
    expect(fabBox.querySelector('.fab-right-column')).toBeTruthy();
    expect(fabBox.querySelector('.fab-status')?.getAttribute('aria-live')).toBe(
      'polite'
    );

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initFiar(board, status);
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.querySelector('.fiar-status')).toBeTruthy();
  });
});
