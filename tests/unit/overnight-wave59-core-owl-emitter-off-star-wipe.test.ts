/**
 * Overnight HEAVY leftover after #280 — off('*') wipes wildcard listeners.
 * Opposite of wave58 off(type) wipe leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { OwlEventEmitter } from '../../src/core/owl';

describe('Wave 59 core owl — emitter off star wipe', () => {
  it('off("*") without handler clears wildcard listeners', () => {
    const bus = new OwlEventEmitter();
    let hits = 0;
    bus.on('*', () => {
      hits++;
    });
    bus.off('*');
    bus.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(hits).toBe(0);
  });
});
