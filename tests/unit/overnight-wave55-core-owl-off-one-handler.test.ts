/**
 * Overnight HEAVY leftover after #250 — off(type, handler) removes only that
 * listener. Distinct from wave40 off(type) wipe-all. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { OwlEventEmitter } from '../../src/core/owl';

describe('Wave 55 core owl — off single handler', () => {
  it('sibling handler still fires after targeted off', () => {
    const emitter = new OwlEventEmitter();
    const hits: string[] = [];
    const a = () => hits.push('a');
    const b = () => hits.push('b');
    emitter.on('milestone:reached', a);
    emitter.on('milestone:reached', b);
    emitter.off('milestone:reached', a);
    emitter.emit({
      type: 'milestone:reached',
      timestamp: 1,
      milestoneType: 'games_won',
      value: 1,
      description: 'one',
    });
    expect(hits).toEqual(['b']);
  });
});
