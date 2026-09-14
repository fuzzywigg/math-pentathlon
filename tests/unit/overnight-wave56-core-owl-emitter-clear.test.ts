/**
 * Overnight HEAVY leftover after #256 — OwlEventEmitter.clear wipes all handlers.
 * Distinct from wave55 off(single) / wave40 off(type). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { OwlEventEmitter } from '../../src/core/owl';

describe('Wave 56 core owl — emitter clear', () => {
  it('clear removes specific and wildcard listeners', () => {
    const emitter = new OwlEventEmitter();
    const hits: string[] = [];
    emitter.on('app:start', () => hits.push('specific'));
    emitter.on('*', () => hits.push('wild'));
    emitter.clear();
    emitter.emit({
      type: 'app:start',
      timestamp: 1,
      isFirstVisit: true,
      daysSinceLastVisit: 0,
    });
    expect(hits).toEqual([]);
  });
});
