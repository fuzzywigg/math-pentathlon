/**
 * Wave 57 leftover after #263 — Hex welcome / objective / board-intro. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 57 hex — tutorial welcome/objective', () => {
  it('welcome title; objective connect sides; board-intro .hex-board', () => {
    const welcome = hexTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Hex!');
    const objective = hexTutorial.steps.find((s) => s.id === 'objective');
    expect(objective?.message).toMatch(/Connect your two opposite sides/);
    const board = hexTutorial.steps.find((s) => s.id === 'board-intro');
    expect(board?.highlightSelector).toBe('.hex-board');
  });
});
