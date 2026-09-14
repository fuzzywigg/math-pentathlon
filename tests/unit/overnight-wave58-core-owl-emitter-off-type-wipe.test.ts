/**
 * Overnight HEAVY leftover after #274 — off(type) without handler wipes all.
 * Distinct from wave57 off-one matching handler. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { OwlEventEmitter } from '../../src/core/owl';

describe('Wave 58 core owl — emitter off type wipe', () => {
  it('off(app:start) with no handler removes every listener', () => {
    const bus = new OwlEventEmitter();
    let a = 0;
    let b = 0;
    bus.on('app:start', () => {
      a++;
    });
    bus.on('app:start', () => {
      b++;
    });
    bus.off('app:start');
    bus.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(a).toBe(0);
    expect(b).toBe(0);
  });
});
