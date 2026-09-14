/**
 * Overnight HEAVY leftover after #274 — OwlEventEmitter.on() return unsubscribes.
 * Distinct from wave57 off(handler); wave56 clear(). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { OwlEventEmitter } from '../../src/core/owl';

describe('Wave 58 core owl — emitter on unsub', () => {
  it('returned unsubscribe silences later app:start emits', () => {
    const bus = new OwlEventEmitter();
    let n = 0;
    const unsub = bus.on('app:start', () => {
      n++;
    });
    bus.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: false,
      daysSinceLastVisit: 0,
    });
    expect(n).toBe(1);
    unsub();
    bus.emit({
      type: 'app:start',
      timestamp: 2,
      isFirstVisit: false,
      daysSinceLastVisit: 0,
    });
    expect(n).toBe(1);
  });
});
