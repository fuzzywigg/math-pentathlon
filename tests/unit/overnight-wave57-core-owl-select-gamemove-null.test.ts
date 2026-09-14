/**
 * Overnight HEAVY leftover after #264 — MESSAGE_LIBRARY has no game:move rows.
 * Distinct from wave56 speakNow which fakes category without library lookup. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 57 core owl — selectMessage game:move', () => {
  it('returns null for empty game:move category', () => {
    expect(owlMessages.selectMessage('game:move', {})).toBeNull();
    expect(owlMessages.getMessagesByCategory('game:move')).toEqual([]);
  });
});
