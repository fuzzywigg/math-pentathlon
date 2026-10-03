/**
 * Wave 57 leftover after #267 — Contig × Sum status live handshake. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame as initContig } from '../../src/games/contig-60/game-controller';
import { newGameVsHuman as sumVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 handshake — contig × sum status live', () => {
  it('both controllers mount polite aria-live status leftover', () => {
    const contigBoard = document.createElement('div');
    const contigStatus = document.createElement('div');
    const sumRoot = document.createElement('div');
    document.body.append(contigBoard, contigStatus, sumRoot);
    initContig(contigBoard, contigStatus);
    sumVsHuman(sumRoot);
    expect(contigStatus.getAttribute('aria-live')).toBe('polite');
    expect(contigStatus.getAttribute('role')).toBe('status');
    const sdStatus = sumRoot.querySelector('.sd-status') as HTMLElement;
    expect(sdStatus.getAttribute('aria-live')).toBe('polite');
    expect(sdStatus.getAttribute('role')).toBe('status');
  });
});
