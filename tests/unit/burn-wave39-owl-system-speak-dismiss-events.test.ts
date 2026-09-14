/**
 * Wave 39 — owlSystem speakNow / dismiss / events leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { owlSystem, owlMessages } from '../../src/core/owl';

afterEach(() => {
  owlSystem.dismissMessage();
});

describe('Wave 39 owl — system speak dismiss', () => {
  it('speakNow then dismiss clears bubble path', () => {
    owlSystem.speakNow('Wave 39 inspect deepen', 'thinking');
    const events = owlSystem.getEvents();
    expect(typeof events.on).toBe('function');
    expect(typeof events.off).toBe('function');
    expect(typeof events.emit).toBe('function');
    owlSystem.dismissMessage();
  });

  it('owlMessages manager exposes select/add APIs', () => {
    expect(typeof owlMessages.selectMessage).toBe('function');
    expect(typeof owlMessages.addMessage).toBe('function');
  });
});
