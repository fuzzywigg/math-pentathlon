/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball target-glow gradient stops.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 56 pinball board — glow stops', () => {
  it('target-glow stops use #ffeb3b opacities leftover', () => {
    const svg = renderPinballBoard(createInitialState());
    const stops = svg.querySelectorAll('#target-glow stop');
    expect(stops.length).toBe(2);
    expect(stops[0].getAttribute('stop-color')).toBe('#ffeb3b');
    expect(stops[0].getAttribute('stop-opacity')).toBe('0.8');
    expect(stops[1].getAttribute('stop-color')).toBe('#ffeb3b');
    expect(stops[1].getAttribute('stop-opacity')).toBe('0');
  });
});
