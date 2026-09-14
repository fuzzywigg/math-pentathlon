/**
 * Wave 39 — owl inspect target chrome/board matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  resolveInspectTarget,
  stubNarrationFor,
  inspectDropSpeech,
} from '../../src/core/owl';

describe('Wave 39 owl — inspect chrome matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('null element → unknown', () => {
    expect(resolveInspectTarget(null)).toEqual({ kind: 'unknown' });
  });

  it('resolves star piece / space / chrome / hex-a-gone', () => {
    document.body.innerHTML = `
      <div class="star-track-piece" data-player="player1"></div>
      <div class="star-track-space" data-space="3" data-player="player2"></div>
      <button data-shape="hex"></button>
      <div data-q="1" data-r="2"></div>
      <div data-node-id="n1"></div>
      <div class="hex-cell-group" data-row="0" data-col="1"></div>
      <div class="cell" data-row="2" data-col="3"></div>
      <button id="help-btn"></button>
    `;
    expect(resolveInspectTarget(document.querySelector('.star-track-piece'))).toEqual({
      kind: 'star-piece',
      player: 'player1',
    });
    expect(resolveInspectTarget(document.querySelector('.star-track-space'))).toEqual({
      kind: 'star-space',
      space: 3,
      player: 'player2',
    });
    expect(resolveInspectTarget(document.querySelector('[data-shape]'))).toEqual({
      kind: 'hex-a-gone-bank',
      shape: 'hex',
    });
    expect(resolveInspectTarget(document.querySelector('[data-q]'))).toEqual({
      kind: 'hex-a-gone-cell',
      q: 1,
      r: 2,
    });
    expect(resolveInspectTarget(document.querySelector('[data-node-id]'))).toEqual({
      kind: 'fiar-node',
      nodeId: 'n1',
    });
    expect(resolveInspectTarget(document.querySelector('.hex-cell-group'))).toEqual({
      kind: 'hex-cell',
      row: 0,
      col: 1,
    });
  });

  it('stubNarrationFor covers kinds; inspectDropSpeech wires resolve', () => {
    const kinds = [
      { kind: 'unknown' as const },
      { kind: 'chrome' as const, chrome: 'howto' as const },
      { kind: 'star-piece' as const, player: 'player1' },
      { kind: 'kings-cell' as const, row: 0, col: 0 },
    ];
    for (const k of kinds) {
      expect(stubNarrationFor(k).length).toBeGreaterThan(0);
    }
    document.body.innerHTML = `<div class="star-track-piece" data-player="player2"></div>`;
    expect(inspectDropSpeech(document.querySelector('.star-track-piece')).length).toBeGreaterThan(0);
  });
});
