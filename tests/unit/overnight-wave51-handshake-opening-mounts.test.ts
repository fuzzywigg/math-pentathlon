/**
 * Wave 51 leftover after #233 — Handshake opening mounts. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderHex } from '../../src/games/hex/board-ui';
import { renderBoard as renderHexagone } from '../../src/games/hex-a-gone/board-ui';
import { renderBoard as renderStars } from '../../src/games/stars-bars/board-ui';
import { renderBoard as renderPar } from '../../src/games/par-55/board-ui';
import { renderBoard as renderKwa } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 handshake — opening mounts', () => {
  it('mounts core chrome for hex/hexagone/stars/par/kwatro', () => {
    const hexBox = document.createElement('div');
    renderHex(hexInit(5), hexBox);
    expect(hexBox.querySelectorAll('.hex-cell-group').length).toBe(25);

    const hag = document.createElement('div');
    renderHexagone(hexagoneInit(), hag);
    expect(hag.querySelector('.hex-a-gone-wrapper')).toBeTruthy();
    expect(hag.querySelectorAll('.hex-a-gone-block-btn').length).toBe(5);

    expect(renderStars(starsInit(), () => undefined).querySelectorAll('.stars-cell').length).toBeGreaterThan(0);
    expect(renderPar(parInit(), () => undefined).querySelectorAll('[data-base-id]').length).toBeGreaterThan(0);
    expect(renderKwa(kwaInit(), () => undefined, () => undefined).querySelectorAll('[data-node-id]').length).toBeGreaterThan(0);
  });
});
