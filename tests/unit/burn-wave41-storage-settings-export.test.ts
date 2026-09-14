/**
 * Wave 41 — Storage settings update + export/import roundtrip leftover.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../src/core/storage';

describe('Wave 41 storage — settings / export', () => {
  beforeEach(() => storage.resetAll());

  it('updateSettings merges owlFrequency', () => {
    storage.createProfile('Cara', '⭐');
    storage.updateSettings({ owlFrequency: 'quiet' });
    expect(storage.getSettings().owlFrequency).toBe('quiet');
    expect(storage.getSettings().owlEnabled).toBe(true);
  });

  it('exportData importData roundtrip preserves profile name', () => {
    storage.createProfile('Dee', '🎯');
    const raw = storage.exportData();
    storage.resetAll();
    expect(storage.getProfile()).toBeNull();
    expect(storage.importData(raw)).toBe(true);
    expect(storage.getProfile()?.name).toBe('Dee');
  });
});
