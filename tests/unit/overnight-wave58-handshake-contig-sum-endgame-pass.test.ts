/**
 * Wave 58 leftover after #275 — Contig × Sum endgame/pass chrome handshake. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

vi.mock('../../src/games/contig-60/types', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/games/contig-60/types')>();
  return {
    ...actual,
    createInitialState: vi.fn(() => actual.createInitialState()),
  };
});

import { createInitialState } from '../../src/games/contig-60/types';
import { initGame as initContig } from '../../src/games/contig-60/game-controller';
import { newGameVsHuman as sumVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
  vi.mocked(createInitialState).mockReset();
});

describe('Wave 58 handshake — contig × sum endgame/pass', () => {
  it('contig Blue banner + sum Red banner + sum Pass controls leftover', async () => {
    const actual = await vi.importActual<typeof import('../../src/games/contig-60/types')>(
      '../../src/games/contig-60/types'
    );
    vi.mocked(createInitialState).mockReturnValue({
      ...actual.createInitialState(),
      winner: 'player1',
      scores: { player1: 10, player2: 4 },
      phase: 'gameOver',
    });

    const contigBoard = document.createElement('div');
    const contigStatus = document.createElement('div');
    const sumRoot = document.createElement('div');
    document.body.append(contigBoard, contigStatus, sumRoot);
    initContig(contigBoard, contigStatus);
    const sum = sumVsHuman(sumRoot);

    expect(contigStatus.querySelector('.contig-winner-banner')?.textContent).toMatch(
      /Blue wins! 10 - 4/
    );

    sum.state = { ...sum.state, phase: 'gameOver', winner: 'player2' };
    sum.update();
    expect(sumRoot.querySelector('.sd-winner-banner')?.textContent).toMatch(/Red Wins!/);

    sum.state = { ...sum.state, phase: 'passing', winner: null };
    sum.update();
    expect(sumRoot.querySelector('.sd-pass-btn')?.textContent).toBe('Pass Turn');
  });
});
