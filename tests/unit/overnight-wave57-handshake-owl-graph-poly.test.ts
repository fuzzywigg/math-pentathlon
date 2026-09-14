/**
 * Overnight HEAVY leftover after #264 — handshake owl × graph × poly.
 * Distinct from wave56 toggle/emitter/howto + star animate<2 + O/styles/mouse.
 * Tests-only. No engines.
 */
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import {
  inspectDropSpeech,
  resolveInspectTarget,
  owlSystem,
} from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import {
  createHexLatticeGraph,
  findNodesWithinDistance,
  getNeighbors,
} from '../../src/core/graph';
import {
  prevRotation,
  nextRotation,
  SIMPLE_SHAPES,
  createBoard,
  solvePlacement,
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

describe('Wave 57 handshake — owl × graph × poly', () => {
  it('hex-cell inspect + hex lattice within-distance + prevRotation/solve', () => {
    const g = document.createElement('div');
    g.className = 'hex-cell-group';
    g.setAttribute('data-row', '0');
    g.setAttribute('data-col', '2');
    expect(resolveInspectTarget(g).kind).toBe('hex-cell');
    expect(inspectDropSpeech(g)).toMatch(/Hex cell/i);

    const lattice = createHexLatticeGraph(1);
    expect(getNeighbors(lattice, '0,0')).toHaveLength(6);
    expect(findNodesWithinDistance(lattice, '0,0', 1)).toHaveLength(7);

    expect(prevRotation(0)).toBe(270);
    expect(nextRotation(270)).toBe(0);
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    expect(solvePlacement(createBoard(1, 1), [mono], 1)[0]).toHaveLength(1);

    owlSystem.speakNow('Wave57 handshake');
    expect(owlSystem.getState().message?.text).toBe('Wave57 handshake');
    owlSystem.dismissMessage();
    expect(owlSystem.getState().message).toBeNull();
  });
});
