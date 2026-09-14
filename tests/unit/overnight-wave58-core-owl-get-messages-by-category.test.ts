/**
 * Overnight HEAVY leftover after #274 — getMessagesByCategory app:return non-empty.
 * Distinct from wave57 select game:move null library. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 58 core owl — getMessagesByCategory', () => {
  it('app:return category exposes streak-big UNSTOPPABLE template', () => {
    const msgs = owlMessages.getMessagesByCategory('app:return');
    expect(msgs.length).toBeGreaterThan(0);
    expect(msgs.some((m) => m.id === 'return-streak-big-1')).toBe(true);
    expect(
      msgs.find((m) => m.id === 'return-streak-big-1')!.text
    ).toMatch(/UNSTOPPABLE/);
  });
});
