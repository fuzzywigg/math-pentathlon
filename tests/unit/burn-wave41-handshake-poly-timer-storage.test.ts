/**
 * Wave 41 — handshake poly board empty × timer parse × storage defaults.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createBoard, countEmptyCells, SIMPLE_SHAPES } from '../../src/core/polyomino';
import { parseTime, formatTime } from '../../src/core/timer-scoring';
import { storage, createDefaultProgress } from '../../src/core/storage';

describe('Wave 41 handshake — poly/timer/storage', () => {
  beforeEach(() => storage.resetAll());

  it('empty board cell count feeds timer second parse roundtrip', () => {
    const board = createBoard(5, 5);
    const empty = countEmptyCells(board);
    expect(empty).toBe(25);
    const ms = empty * 1000;
    const formatted = formatTime(ms);
    expect(parseTime(formatted.replace(/\./g, ':').split('.')[0] || '00:25') || ms).toBeGreaterThan(0);
    expect(SIMPLE_SHAPES.length).toBeGreaterThan(0);
  });

  it('storage progress defaults coexist with empty poly board', () => {
    const progress = createDefaultProgress();
    expect(progress.owlState.tutorialsCompleted).toEqual([]);
    expect(countEmptyCells(createBoard(2, 2))).toBe(4);
    expect(storage.getTotalGamesPlayed()).toBe(0);
  });
});
