/**
 * Wave 57 leftover after #267 — Contig × Sum chrome mounts handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame as initContig } from '../../src/games/contig-60/game-controller';
import { newGameVsHuman as sumVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 handshake — contig × sum chrome mounts', () => {
  it('mounts contig styles/roll and sum styles/hand labels', () => {
    const contigBoard = document.createElement('div');
    const contigStatus = document.createElement('div');
    const sumRoot = document.createElement('div');
    document.body.append(contigBoard, contigStatus, sumRoot);
    initContig(contigBoard, contigStatus);
    sumVsHuman(sumRoot);
    expect(document.getElementById('contig-styles')).toBeTruthy();
    expect(contigBoard.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(document.getElementById('sd-styles')).toBeTruthy();
    expect(sumRoot.querySelector('.sd-hand-label')).toBeTruthy();
  });
});
