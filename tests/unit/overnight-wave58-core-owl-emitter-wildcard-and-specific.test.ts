/**
 * Overnight HEAVY leftover after #274 — specific + wildcard both fire on emit.
 * Distinct from wave56 clear / wave57 off-one. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { OwlEventEmitter } from '../../src/core/owl';

describe('Wave 58 core owl — emitter wildcard and specific', () => {
  it('emit runs typed handler then wildcard', () => {
    const bus = new OwlEventEmitter();
    const order: string[] = [];
    bus.on('game:start', () => order.push('specific'));
    bus.on('*', () => order.push('wild'));
    bus.emit({
      type: 'game:start',
      timestamp: 1,
      gameId: 'g',
      gameName: 'G',
      isFirstTime: true,
      playerCount: 2,
    });
    expect(order).toEqual(['specific', 'wild']);
  });
});
