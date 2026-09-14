/**
 * Wave 40 — ollie inspect stubNarrationFor / inspectDropSpeech leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  stubNarrationFor,
  inspectDropSpeech,
  resolveInspectTarget,
  type InspectTarget,
} from '../../src/core/owl';

describe('Wave 40 ollie-inspect — stub speech', () => {
  const mounted: Element[] = [];

  afterEach(() => {
    mounted.splice(0).forEach((el) => el.remove());
  });

  it('stubNarrationFor covers every target kind with STUB prefix', () => {
    const samples: InspectTarget[] = [
      { kind: 'kings-cell', row: 1, col: 2 },
      { kind: 'hex-cell', row: 0, col: 1 },
      { kind: 'fiar-node', nodeId: 'n7' },
      { kind: 'hex-a-gone-cell', q: -1, r: 2 },
      { kind: 'hex-a-gone-bank', shape: 'triangle' },
      { kind: 'star-space', space: 3, player: 'player1' },
      { kind: 'star-piece', player: 'player2' },
      { kind: 'chrome', chrome: 'howto' },
      { kind: 'unknown' },
    ];

    for (const target of samples) {
      const line = stubNarrationFor(target);
      expect(line.startsWith('[STUB inspect]')).toBe(true);
      expect(line.length).toBeGreaterThan(20);
    }
  });

  it('inspectDropSpeech mirrors resolve + stub for a live element', () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = '4';
    cell.dataset.col = '1';
    document.body.appendChild(cell);
    mounted.push(cell);

    const speech = inspectDropSpeech(cell);
    const resolved = resolveInspectTarget(cell);
    expect(speech).toBe(stubNarrationFor(resolved));
    expect(speech).toContain('row 4');
    expect(speech).toContain('column 1');
  });

  it('inspectDropSpeech(null) still returns unknown stub line', () => {
    // resolveInspectTarget(null) → unknown; inspectDropSpeech always returns string
    const speech = inspectDropSpeech(null);
    expect(speech.startsWith('[STUB inspect]')).toBe(true);
    expect(speech).toMatch(/don't recognize|recognize that spot/i);
  });

  it('board-specific stubs mention coordinates / ids', () => {
    expect(
      stubNarrationFor({ kind: 'hex-a-gone-cell', q: 0, r: -2 })
    ).toContain('q=0');
    expect(
      stubNarrationFor({ kind: 'hex-a-gone-cell', q: 0, r: -2 })
    ).toContain('r=-2');
    expect(stubNarrationFor({ kind: 'fiar-node', nodeId: 'corner' })).toContain(
      'corner'
    );
    expect(
      stubNarrationFor({ kind: 'hex-a-gone-bank', shape: 'trapezoid' })
    ).toContain('trapezoid');
  });
});
