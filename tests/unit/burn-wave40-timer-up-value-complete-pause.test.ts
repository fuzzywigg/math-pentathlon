/**
 * Wave 40 — timer up value / complete / pause noop / reset leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createTimer,
  startTimer,
  pauseTimer,
  resetTimer,
  getTimerValue,
  isTimerComplete,
} from '../../src/core/timer-scoring';

describe('Wave 40 timer — up value / complete / pause / reset', () => {
  it('direction up uses elapsed; complete always false', () => {
    let t = createTimer({ direction: 'up', initialTime: 0 });
    t = { ...t, elapsed: 1500 };
    expect(getTimerValue(t)).toBe(1500);
    expect(isTimerComplete(t)).toBe(false);
  });

  it('pause when not running is noop; reset clears running', () => {
    let t = createTimer({ direction: 'down', initialTime: 5000 });
    const paused = pauseTimer(t);
    expect(paused).toEqual(t);
    t = startTimer(t);
    expect(t.state).toBe('running');
    t = resetTimer(t);
    expect(t.state).toBe('stopped');
    expect(t.startTime).toBeNull();
    expect(t.remaining).toBe(5000);
  });
});
