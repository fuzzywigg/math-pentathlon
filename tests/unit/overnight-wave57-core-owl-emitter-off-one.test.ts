/**
 * Overnight HEAVY leftover after #264 — OwlEventEmitter.off removes app:start handler.
 * Distinct from wave55 milestone off-one; wave56 clear() wipe. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { OwlEventEmitter } from '../../src/core/owl';

describe('Wave 57 core owl — emitter off one', () => {
  it('off unsubscribes only the matching app:start handler', () => {
    const bus = new OwlEventEmitter();
    let a = 0;
    let b = 0;
    const ha = () => {
      a++;
    };
    const hb = () => {
      b++;
    };
    bus.on('app:start', ha);
    bus.on('app:start', hb);
    bus.off('app:start', ha);
    bus.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(a).toBe(0);
    expect(b).toBe(1);
  });
});
