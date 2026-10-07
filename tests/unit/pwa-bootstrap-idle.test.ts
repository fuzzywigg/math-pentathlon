import { describe, expect, it, vi } from 'vitest';
import { bootstrapPwa } from '../../src/pwa/bootstrap';

describe('bootstrapPwa idle deferral', () => {
  it('schedules registration instead of running synchronously', () => {
    const schedule = vi.fn();
    bootstrapPwa({ schedule });
    expect(schedule).toHaveBeenCalledTimes(1);
    // Callback not invoked by the fake schedule — registration stays deferred.
  });

  it('no-ops when disabled', () => {
    const schedule = vi.fn();
    bootstrapPwa({ enabled: false, schedule });
    expect(schedule).not.toHaveBeenCalled();
  });
});
