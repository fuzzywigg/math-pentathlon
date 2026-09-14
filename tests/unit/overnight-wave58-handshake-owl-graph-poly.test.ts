/**
 * Overnight HEAVY leftover after #274 — handshake owl × graph × poly.
 * Distinct from wave57 hex-cell/hex-lattice/prevRotation/solve.
 * Tests-only. No engines.
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import {
  resolveInspectTarget,
  inspectDropSpeech,
  owlSystem,
} from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import {
  createStarGraph,
  getNeighbors,
  createCompleteGraph,
} from '../../src/core/graph';
import {
  createRotationControls,
  getPolyominoById,
  validatePlacement,
  createBoard,
} from '../../src/core/polyomino';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  owlSystem.hide();
});

afterEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
  storage.resetAll();
  owlSystem.hide();
});

describe('Wave 58 handshake — owl × graph × poly', () => {
  it('bare header + star(1) + CCW controls + hexagon OOB validate', () => {
    const header = document.createElement('header');
    header.className = 'game-header';
    document.body.appendChild(header);
    expect(resolveInspectTarget(header).kind).toBe('chrome');
    expect(inspectDropSpeech(header)).toMatch(/title area/i);

    const star = createStarGraph(1);
    expect(getNeighbors(star, 'center')).toEqual(['n0']);
    expect(createCompleteGraph(4).edges).toHaveLength(6);

    const onRotate: Array<'cw' | 'ccw'> = [];
    const el = createRotationControls((d) => onRotate.push(d), () => {}, false);
    document.body.appendChild(el);
    const ccw = [...el.querySelectorAll('button')].find(
      (b) => b.title === 'Rotate counter-clockwise'
    )!;
    ccw.click();
    expect(onRotate).toEqual(['ccw']);

    const hex = getPolyominoById('hexagon')!;
    expect(
      validatePlacement(createBoard(1, 1), hex, { row: 2, col: 2 }).reason
    ).toMatch(/beyond board/i);

    owlSystem.speakNow('Wave58 handshake', 'proud');
    expect(owlSystem.getState().mood).toBe('proud');
    owlSystem.dismissMessage();
    expect(owlSystem.getState().message).toBeNull();
  });
});
