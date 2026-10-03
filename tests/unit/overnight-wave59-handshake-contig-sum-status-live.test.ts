/**
 * Wave 59 Contig/SD residual — Contig × Sum status aria-live handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame as initContig } from '../../src/games/contig-60/game-controller';
import { newGameVsHuman as sumVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 handshake — status aria-live', () => {
  it('contig status container and sum .sd-status are polite live', () => {
    const contigBoard = document.createElement('div');
    const contigStatus = document.createElement('div');
    const sumRoot = document.createElement('div');
    document.body.append(contigBoard, contigStatus, sumRoot);
    initContig(contigBoard, contigStatus);
    sumVsHuman(sumRoot);
    expect(contigStatus.getAttribute('aria-live')).toBe('polite');
    expect(sumRoot.querySelector('.sd-status')?.getAttribute('aria-live')).toBe(
      'polite'
    );
  });
});
